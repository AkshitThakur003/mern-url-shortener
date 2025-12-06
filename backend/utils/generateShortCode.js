const crypto = require('crypto');

/**
 * Generate a random short code using cryptographically secure random bytes
 * @param {number} length - Length of the short code (default: 6)
 * @returns {string} Random short code in hexadecimal format
 * @example
 * generateShortCode(6) // Returns: "a3f9b2"
 */
const generateShortCode = (length = 6) => {
  return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
};

/**
 * Validate if a string is a valid URL
 * Checks for http:// or https:// protocols
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid URL, false otherwise
 * @example
 * isValidUrl("https://example.com") // Returns: true
 * isValidUrl("not-a-url") // Returns: false
 */
const isValidUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Normalize URL by adding https:// protocol if missing
 * Trims whitespace and ensures protocol is present
 * @param {string} url - URL to normalize
 * @returns {string} Normalized URL with protocol
 * @example
 * normalizeUrl("example.com") // Returns: "https://example.com"
 * normalizeUrl("https://example.com") // Returns: "https://example.com"
 */
const normalizeUrl = (url) => {
  url = url.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
};

module.exports = {
  generateShortCode,
  isValidUrl,
  normalizeUrl,
};

