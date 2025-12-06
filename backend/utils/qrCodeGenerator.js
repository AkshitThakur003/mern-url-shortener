const QRCode = require('qrcode');

/**
 * Generate QR code for a URL
 * @param {string} url - The URL to encode in the QR code
 * @param {object} options - QR code options
 * @returns {Promise<string>} - Base64 encoded QR code image
 */
const generateQRCode = async (url, options = {}) => {
  try {
    const defaultOptions = {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      width: 300,
      ...options,
    };

    const qrCodeDataURL = await QRCode.toDataURL(url, defaultOptions);
    return qrCodeDataURL;
  } catch (error) {
    throw new Error(`Failed to generate QR code: ${error.message}`);
  }
};

module.exports = { generateQRCode };

