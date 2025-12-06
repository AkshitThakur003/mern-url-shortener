const swaggerJsdoc = require('swagger-jsdoc');

/**
 * Swagger configuration for API documentation
 */
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Linkly API',
      version: '1.0.0',
      description: 'A comprehensive URL shortening service API with authentication, analytics, and advanced features',
      contact: {
        name: 'Linkly Support',
        email: 'support@linkly.com',
      },
      license: {
        name: 'ISC',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
      {
        url: 'https://api.linkly.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

