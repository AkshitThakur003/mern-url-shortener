/**
 * Unit tests for URL routes
 */
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../../server');
const User = require('../../../models/User');
const Url = require('../../../models/Url');
const { generateToken } = require('../../../utils/generateToken');

describe('URL Routes', () => {
  let authToken;
  let userId;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Url.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Create a test user and get auth token
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });
    userId = user._id;
    authToken = generateToken(userId);
    await Url.deleteMany({});
  });

  describe('POST /api/urls', () => {
    it('should create a short URL successfully', async () => {
      const response = await request(app)
        .post('/api/urls')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          originalUrl: 'https://example.com',
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.url.shortCode).toBeDefined();
      expect(response.body.data.url.shortUrl).toBeDefined();
    });

    it('should reject invalid URL', async () => {
      const response = await request(app)
        .post('/api/urls')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          originalUrl: 'not-a-valid-url',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/urls')
        .send({
          originalUrl: 'https://example.com',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/urls', () => {
    beforeEach(async () => {
      // Create test URLs
      await Url.create({
        originalUrl: 'https://example.com',
        shortCode: 'test123',
        createdBy: userId,
      });
    });

    it('should get all URLs for authenticated user', async () => {
      const response = await request(app)
        .get('/api/urls')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.urls)).toBe(true);
    });
  });
});

