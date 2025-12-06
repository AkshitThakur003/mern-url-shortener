/**
 * Send standardized error response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {Array|null} errors - Optional array of validation errors
 * @returns {Object} JSON error response
 */
const sendErrorResponse = (res, statusCode, message, errors = null) => {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * Handle MongoDB duplicate key errors
 * Extracts field name from error and returns user-friendly message
 * @param {Error} error - MongoDB error object
 * @returns {Object|null} Error object with message and statusCode, or null if not a duplicate key error
 */
const handleMongoError = (error) => {
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern)[0];
    return {
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
      statusCode: 400,
    };
  }
  return null;
};

module.exports = { sendErrorResponse, handleMongoError };

