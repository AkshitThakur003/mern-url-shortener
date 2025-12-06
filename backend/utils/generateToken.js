const jwt = require('jsonwebtoken');

/**
 * Generate JWT access token for user authentication
 * @param {string} id - User ID to encode in token
 * @returns {string} JWT access token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

/**
 * Generate JWT refresh token for token renewal
 * @param {string} id - User ID to encode in token
 * @returns {string} JWT refresh token
 */
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d',
  });
};

module.exports = { generateToken, generateRefreshToken };

