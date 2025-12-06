/**
 * Integration tests for API endpoints
 * Tests the full request/response cycle
 */
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../../server');
const User = require('../../../models/User');
const Url = require('../../../models/Url');

describe('API Integration Tests', () => {
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
    // Create test user and get token
    const user = await User.create({
      name: 'Integration Test User',
      email: `integration${Date.now()}@test.com`,
      password: 'password123',
    });
    userId = user._id;
    
    // Login to get token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: user.email,
        password: 'password123',
      });
    
    authToken = loginResponse.body.data.token;
    await Url.deleteMany({});
  });

  describe('Complete URL Workflow', () => {
    it('should create, retrieve, update, and delete a URL', async () => {
      // Create URL
      const createResponse = await request(app)
        .post('/api/urls')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          originalUrl: 'https://example.com',
        })
        .expect(201);

      const urlId = createResponse.body.data.url.id;

      // Get URL
      const getResponse = await request(app)
        .get(`/api/urls/${urlId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(getResponse.body.data.url.originalUrl).toBe('https://example.com');

      // Update URL (disable)
      await request(app)
        .patch(`/api/urls/${urlId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ disabled: true })
        .expect(200);

      // Delete URL
      await request(app)
        .delete(`/api/urls/${urlId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    });
  });

  describe('Bulk URL Creation', () => {
    it('should create multiple URLs at once', async () => {
      const response = await request(app)
        .post('/api/urls/bulk')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          urls: [
            { originalUrl: 'https://example.com/1' },
            { originalUrl: 'https://example.com/2' },
            { originalUrl: 'https://example.com/3' },
          ],
        })
        .expect(201);

      expect(response.body.data.urls).toHaveLength(3);
      expect(response.body.message).toContain('Created 3 of 3 URLs');
    });
  });
});

