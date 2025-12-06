const express = require('express');
const { body, validationResult } = require('express-validator');
const Url = require('../models/Url');
const { protect } = require('../middleware/auth');
const { sendErrorResponse } = require('../utils/errorHandler');
const { generateShortCode, isValidUrl, normalizeUrl } = require('../utils/generateShortCode');
const { generateQRCode } = require('../utils/qrCodeGenerator');
const { fetchLinkPreview } = require('../utils/linkPreview');
const { urlCreationLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

/**
 * @swagger
 * /api/urls:
 *   post:
 *     summary: Create a short URL
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - originalUrl
 *             properties:
 *               originalUrl:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/very/long/url
 *               shortCode:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 20
 *                 pattern: '^[a-z0-9-_]+$'
 *                 example: my-link
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *               generateQR:
 *                 type: boolean
 *                 default: false
 *               fetchPreview:
 *                 type: boolean
 *                 default: false
 *     responses:
 *       201:
 *         description: URL created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/',
  protect,
  urlCreationLimiter,
  [
    body('originalUrl')
      .notEmpty()
      .withMessage('Original URL is required')
      .custom((value) => {
        const normalized = normalizeUrl(value);
        if (!isValidUrl(normalized)) {
          throw new Error('Please provide a valid URL');
        }
        return true;
      }),
    body('shortCode')
      .optional()
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage('Short code must be between 3 and 20 characters')
      .matches(/^[a-z0-9-_]+$/)
      .withMessage('Short code can only contain lowercase letters, numbers, hyphens, and underscores'),
    body('expiresAt')
      .optional()
      .custom((value) => {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          throw new Error('Expiry date must be a valid date');
        }
        if (date <= new Date()) {
          throw new Error('Expiry date must be in the future');
        }
        return true;
      }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendErrorResponse(
        res,
        400,
        'Validation error',
        errors.array().map((err) => ({ field: err.param, message: err.msg }))
      );
    }

    try {
      const { originalUrl, shortCode: customShortCode, expiresAt } = req.body;
      const normalizedUrl = normalizeUrl(originalUrl);

      // Generate short code or use custom one
      let shortCode = customShortCode;
      if (!shortCode) {
        shortCode = generateShortCode(6);
        // Ensure uniqueness
        let exists = await Url.findOne({ shortCode });
        let attempts = 0;
        while (exists && attempts < 10) {
          shortCode = generateShortCode(6);
          exists = await Url.findOne({ shortCode });
          attempts++;
        }
        if (exists) {
          return sendErrorResponse(res, 500, 'Failed to generate unique short code. Please try again.');
        }
      } else {
        // Check if custom short code already exists
        const existingUrl = await Url.findOne({ shortCode: customShortCode.toLowerCase() });
        if (existingUrl) {
          return sendErrorResponse(res, 400, 'This short code is already taken. Please choose another one.');
        }
      }

      // Create URL
      const url = await Url.create({
        originalUrl: normalizedUrl,
        shortCode: shortCode.toLowerCase(),
        createdBy: req.user._id,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      });

      // Generate QR code if requested
      let qrCode = null;
      if (req.body.generateQR === true) {
        try {
          const shortUrl = `${req.protocol}://${req.get('host')}/${url.shortCode}`;
          qrCode = await generateQRCode(shortUrl);
        } catch (error) {
          console.error('QR code generation error:', error);
          // Don't fail the request if QR code generation fails
        }
      }

      // Fetch link preview if requested
      let preview = null;
      if (req.body.fetchPreview === true) {
        try {
          preview = await fetchLinkPreview(normalizedUrl);
        } catch (error) {
          console.error('Link preview error:', error);
          // Don't fail the request if preview fetch fails
        }
      }

      res.status(201).json({
        success: true,
        message: 'Short URL created successfully',
        data: {
          url: {
            id: url._id,
            originalUrl: url.originalUrl,
            shortCode: url.shortCode,
            shortUrl: `${req.protocol}://${req.get('host')}/${url.shortCode}`,
            clicks: url.clicks,
            expiresAt: url.expiresAt,
            disabled: url.disabled,
            createdAt: url.createdAt,
            qrCode,
            preview,
          },
        },
      });
    } catch (error) {
      console.error('Create URL error:', error);
      
      if (error.code === 11000) {
        return sendErrorResponse(res, 400, 'This short code is already taken. Please choose another one.');
      }
      
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((err) => err.message);
        return sendErrorResponse(res, 400, 'Validation error', messages);
      }

      return sendErrorResponse(res, 500, 'Server error. Please try again later.');
    }
  }
);

// @route   GET /api/urls
// @desc    Get all URLs for the authenticated user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const urls = await Url.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .select('-analytics');

    res.json({
      success: true,
      data: {
        urls: urls.map((url) => ({
          id: url._id,
          originalUrl: url.originalUrl,
          shortCode: url.shortCode,
          shortUrl: `${req.protocol}://${req.get('host')}/${url.shortCode}`,
          clicks: url.clicks,
          expiresAt: url.expiresAt,
          disabled: url.disabled,
          isExpired: url.isExpired(),
          isActive: url.isActive(),
          createdAt: url.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error('Get URLs error:', error);
    return sendErrorResponse(res, 500, 'Server error. Please try again later.');
  }
});

/**
 * @swagger
 * /api/urls/stats:
 *   get:
 *     summary: Get aggregated statistics for the authenticated user
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics including total URLs, clicks, top URLs, and weekly analytics
 */
router.get('/stats', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all URLs for the user
    const urls = await Url.find({ createdBy: userId });

    // Calculate aggregated stats
    const totalUrls = urls.length;
    const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);
    const activeCount = urls.filter((url) => url.isActive()).length;
    const expiredCount = urls.filter((url) => url.isExpired()).length;

    // Get top 5 URLs by clicks
    const topUrls = urls
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5)
      .map((url) => ({
        id: url._id,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        shortUrl: `${req.protocol}://${req.get('host')}/${url.shortCode}`,
        clicks: url.clicks,
      }));

    // Calculate weekly clicks analytics (last 7 days)
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Get all analytics from the last 7 days
    const weeklyAnalytics = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      
      let clicksForDay = 0;
      urls.forEach((url) => {
        url.analytics.forEach((analytics) => {
          const analyticsDate = new Date(analytics.timestamp);
          if (analyticsDate >= startOfDay && analyticsDate <= endOfDay) {
            clicksForDay++;
          }
        });
      });

      weeklyAnalytics.push({
        date: startOfDay.toISOString().split('T')[0],
        clicks: clicksForDay,
      });
    }

    res.json({
      success: true,
      data: {
        aggregated: {
          totalUrls,
          totalClicks,
          activeCount,
          expiredCount,
        },
        topUrls,
        weeklyAnalytics,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return sendErrorResponse(res, 500, 'Server error. Please try again later.');
  }
});

// @route   GET /api/urls/:id
// @desc    Get a single URL by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const url = await Url.findOne({ _id: req.params.id, createdBy: req.user._id });

    if (!url) {
      return sendErrorResponse(res, 404, 'URL not found');
    }

    res.json({
      success: true,
      data: {
        url: {
          id: url._id,
          originalUrl: url.originalUrl,
          shortCode: url.shortCode,
          shortUrl: `${req.protocol}://${req.get('host')}/${url.shortCode}`,
          clicks: url.clicks,
          expiresAt: url.expiresAt,
          disabled: url.disabled,
          isExpired: url.isExpired(),
          isActive: url.isActive(),
          analytics: url.analytics.slice(-50), // Last 50 analytics entries
          createdAt: url.createdAt,
        },
      },
    });
  } catch (error) {
    console.error('Get URL error:', error);
    if (error.name === 'CastError') {
      return sendErrorResponse(res, 400, 'Invalid URL ID');
    }
    return sendErrorResponse(res, 500, 'Server error. Please try again later.');
  }
});

// @route   PATCH /api/urls/:id
// @desc    Update a URL (disable/enable)
// @access  Private
router.patch('/:id', protect, async (req, res) => {
  try {
    const { disabled } = req.body;
    const url = await Url.findOne({ _id: req.params.id, createdBy: req.user._id });

    if (!url) {
      return sendErrorResponse(res, 404, 'URL not found');
    }

    if (disabled !== undefined) {
      url.disabled = disabled;
      await url.save();
    }

    res.json({
      success: true,
      message: 'URL updated successfully',
      data: {
        url: {
          id: url._id,
          originalUrl: url.originalUrl,
          shortCode: url.shortCode,
          shortUrl: `${req.protocol}://${req.get('host')}/${url.shortCode}`,
          clicks: url.clicks,
          expiresAt: url.expiresAt,
          disabled: url.disabled,
          isExpired: url.isExpired(),
          isActive: url.isActive(),
        },
      },
    });
  } catch (error) {
    console.error('Update URL error:', error);
    if (error.name === 'CastError') {
      return sendErrorResponse(res, 400, 'Invalid URL ID');
    }
    return sendErrorResponse(res, 500, 'Server error. Please try again later.');
  }
});

// @route   DELETE /api/urls/:id
// @desc    Delete a URL
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const url = await Url.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });

    if (!url) {
      return sendErrorResponse(res, 404, 'URL not found');
    }

    res.json({
      success: true,
      message: 'URL deleted successfully',
    });
  } catch (error) {
    console.error('Delete URL error:', error);
    if (error.name === 'CastError') {
      return sendErrorResponse(res, 400, 'Invalid URL ID');
    }
    return sendErrorResponse(res, 500, 'Server error. Please try again later.');
  }
});

/**
 * @swagger
 * /api/urls/bulk:
 *   post:
 *     summary: Create multiple short URLs at once
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - urls
 *             properties:
 *               urls:
 *                 type: array
 *                 minItems: 1
 *                 maxItems: 50
 *                 items:
 *                   type: object
 *                   required:
 *                     - originalUrl
 *                   properties:
 *                     originalUrl:
 *                       type: string
 *                       format: uri
 *                     shortCode:
 *                       type: string
 *                     expiresAt:
 *                       type: string
 *                       format: date-time
 *     responses:
 *       201:
 *         description: URLs created (may include errors for some)
 *       400:
 *         description: Validation error
 */
router.post(
  '/bulk',
  protect,
  urlCreationLimiter,
  [
    body('urls')
      .isArray({ min: 1, max: 50 })
      .withMessage('URLs must be an array with 1-50 items'),
    body('urls.*.originalUrl')
      .notEmpty()
      .withMessage('Original URL is required for each item')
      .custom((value) => {
        const normalized = normalizeUrl(value);
        if (!isValidUrl(normalized)) {
          throw new Error('Please provide a valid URL');
        }
        return true;
      }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendErrorResponse(
        res,
        400,
        'Validation error',
        errors.array().map((err) => ({ field: err.param, message: err.msg }))
      );
    }

    try {
      const { urls } = req.body;
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const createdUrls = [];
      const errors = [];

      for (let i = 0; i < urls.length; i++) {
        try {
          const { originalUrl, shortCode: customShortCode, expiresAt } = urls[i];
          const normalizedUrl = normalizeUrl(originalUrl);

          let shortCode = customShortCode;
          if (!shortCode) {
            shortCode = generateShortCode(6);
            let exists = await Url.findOne({ shortCode });
            let attempts = 0;
            while (exists && attempts < 10) {
              shortCode = generateShortCode(6);
              exists = await Url.findOne({ shortCode });
              attempts++;
            }
            if (exists) {
              errors.push({ index: i, url: originalUrl, error: 'Failed to generate unique short code' });
              continue;
            }
          } else {
            const existingUrl = await Url.findOne({ shortCode: customShortCode.toLowerCase() });
            if (existingUrl) {
              errors.push({ index: i, url: originalUrl, error: 'Short code already taken' });
              continue;
            }
          }

          const url = await Url.create({
            originalUrl: normalizedUrl,
            shortCode: shortCode.toLowerCase(),
            createdBy: req.user._id,
            expiresAt: expiresAt ? new Date(expiresAt) : null,
          });

          createdUrls.push({
            id: url._id,
            originalUrl: url.originalUrl,
            shortCode: url.shortCode,
            shortUrl: `${baseUrl}/${url.shortCode}`,
            clicks: url.clicks,
            expiresAt: url.expiresAt,
            disabled: url.disabled,
            createdAt: url.createdAt,
          });
        } catch (error) {
          errors.push({ index: i, url: urls[i].originalUrl, error: error.message });
        }
      }

      res.status(201).json({
        success: true,
        message: `Created ${createdUrls.length} of ${urls.length} URLs`,
        data: {
          urls: createdUrls,
          errors: errors.length > 0 ? errors : undefined,
        },
      });
    } catch (error) {
      console.error('Bulk create URLs error:', error);
      return sendErrorResponse(res, 500, 'Server error. Please try again later.');
    }
  }
);

/**
 * @swagger
 * /api/urls/{id}/qr:
 *   get:
 *     summary: Get QR code for a short URL
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: URL ID
 *     responses:
 *       200:
 *         description: QR code generated successfully
 *       404:
 *         description: URL not found
 */
router.get('/:id/qr', protect, async (req, res) => {
  try {
    const url = await Url.findOne({ _id: req.params.id, createdBy: req.user._id });

    if (!url) {
      return sendErrorResponse(res, 404, 'URL not found');
    }

    const shortUrl = `${req.protocol}://${req.get('host')}/${url.shortCode}`;
    const qrCode = await generateQRCode(shortUrl);

    res.json({
      success: true,
      data: {
        qrCode,
        shortUrl,
      },
    });
  } catch (error) {
    console.error('Generate QR code error:', error);
    if (error.name === 'CastError') {
      return sendErrorResponse(res, 400, 'Invalid URL ID');
    }
    return sendErrorResponse(res, 500, 'Failed to generate QR code');
  }
});

/**
 * @swagger
 * /api/urls/preview:
 *   post:
 *     summary: Get link preview/metadata for a URL
 *     tags: [URLs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *             properties:
 *               url:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com
 *     responses:
 *       200:
 *         description: Link preview fetched successfully
 *       400:
 *         description: Invalid URL
 */
router.post(
  '/preview',
  protect,
  [
    body('url')
      .notEmpty()
      .withMessage('URL is required')
      .custom((value) => {
        const normalized = normalizeUrl(value);
        if (!isValidUrl(normalized)) {
          throw new Error('Please provide a valid URL');
        }
        return true;
      }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendErrorResponse(
        res,
        400,
        'Validation error',
        errors.array().map((err) => ({ field: err.param, message: err.msg }))
      );
    }

    try {
      const { url } = req.body;
      const normalizedUrl = normalizeUrl(url);
      const preview = await fetchLinkPreview(normalizedUrl);

      res.json({
        success: true,
        data: {
          url: normalizedUrl,
          preview,
        },
      });
    } catch (error) {
      console.error('Fetch preview error:', error);
      return sendErrorResponse(res, 500, 'Failed to fetch link preview');
    }
  }
);

module.exports = router;

