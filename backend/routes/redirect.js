const express = require('express');
const Url = require('../models/Url');
const { sendErrorResponse } = require('../utils/errorHandler');

const router = express.Router();

// @route   GET /:shortCode
// @desc    Redirect to original URL
// @access  Public
router.get('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;

    // Find URL by short code
    const url = await Url.findOne({ shortCode: shortCode.toLowerCase() });

    if (!url) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>URL Not Found</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
            }
            .container {
              text-align: center;
              padding: 2rem;
            }
            h1 { font-size: 3rem; margin: 0; }
            p { font-size: 1.2rem; margin: 1rem 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>404</h1>
            <p>Short URL not found</p>
          </div>
        </body>
        </html>
      `);
    }

    // Check if URL is disabled
    if (url.disabled) {
      return res.status(403).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>URL Disabled</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
              color: white;
            }
            .container {
              text-align: center;
              padding: 2rem;
            }
            h1 { font-size: 3rem; margin: 0; }
            p { font-size: 1.2rem; margin: 1rem 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Disabled</h1>
            <p>This short URL has been disabled</p>
          </div>
        </body>
        </html>
      `);
    }

    // Check if URL is expired
    if (url.isExpired()) {
      return res.status(410).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>URL Expired</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
              color: white;
            }
            .container {
              text-align: center;
              padding: 2rem;
            }
            h1 { font-size: 3rem; margin: 0; }
            p { font-size: 1.2rem; margin: 1rem 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Expired</h1>
            <p>This short URL has expired</p>
          </div>
        </body>
        </html>
      `);
    }

    // Extract request information for analytics
    // Handle IP from various sources (proxies, load balancers, etc.)
    let ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim();
    if (!ip) {
      ip = req.headers['x-real-ip'];
    }
    if (!ip) {
      ip = req.connection?.remoteAddress;
    }
    if (!ip) {
      ip = req.socket?.remoteAddress;
    }
    if (!ip) {
      ip = req.ip;
    }
    ip = ip || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';
    
    // Parse user agent (simple parsing)
    let browser = 'unknown';
    let device = 'unknown';
    
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';
    else if (userAgent.includes('Opera')) browser = 'Opera';
    
    if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone')) {
      device = 'Mobile';
    } else if (userAgent.includes('Tablet') || userAgent.includes('iPad')) {
      device = 'Tablet';
    } else {
      device = 'Desktop';
    }

    // Get country from IP (simplified - in production, use a service like GeoIP)
    const country = 'Unknown';

    // Add analytics entry
    url.analytics.push({
      timestamp: new Date(),
      ip,
      browser,
      device,
      country,
    });

    // Increment clicks
    url.clicks += 1;

    // Save URL
    await url.save();

    // Redirect to original URL
    res.redirect(url.originalUrl);
  } catch (error) {
    console.error('Redirect error:', error);
    return res.status(500).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Server Error</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: #f0f0f0;
            color: #333;
          }
          .container {
            text-align: center;
            padding: 2rem;
          }
          h1 { font-size: 3rem; margin: 0; }
          p { font-size: 1.2rem; margin: 1rem 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>500</h1>
          <p>Server error. Please try again later.</p>
        </div>
      </body>
      </html>
    `);
  }
});

module.exports = router;

