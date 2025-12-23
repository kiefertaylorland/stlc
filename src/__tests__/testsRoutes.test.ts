import request from 'supertest';
import express, { Express } from 'express';
import testsRouter from '../routes/tests';

describe('Tests Routes', () => {
  let app: Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/v1/tests', testsRouter);
  });

  describe('POST /api/v1/tests/generate', () => {
    it('should return 400 if description is missing', async () => {
      const response = await request(app)
        .post('/api/v1/tests/generate')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Description is required');
    });

    it('should return 400 if description is not a string', async () => {
      const response = await request(app)
        .post('/api/v1/tests/generate')
        .send({ description: 123 });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Description must be a string');
    });

    it('should return 400 if description exceeds max length', async () => {
      const longDescription = 'a'.repeat(2001);
      const response = await request(app)
        .post('/api/v1/tests/generate')
        .send({ description: longDescription });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('must not exceed 2000 characters');
    });

    it('should successfully generate a test', async () => {
      const response = await request(app)
        .post('/api/v1/tests/generate')
        .send({ description: 'Test login functionality' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.test).toBeDefined();
      expect(response.body.test).toHaveProperty('id');
      expect(response.body.test).toHaveProperty('name');
      expect(response.body.test).toHaveProperty('code');
      expect(response.body.test.code).toContain('@playwright/test');
    });

    it('should escape special characters in description', async () => {
      const response = await request(app)
        .post('/api/v1/tests/generate')
        .send({ description: "Test with 'quotes' and \\backslashes\\" });

      expect(response.status).toBe(200);
      expect(response.body.test.code).toContain(String.raw`\'`);
      expect(response.body.test.code).toContain(String.raw`\\`);
    });

    it('should return 400 for invalid sourceType', async () => {
      const response = await request(app)
        .post('/api/v1/tests/generate')
        .send({ 
          description: 'Test login functionality',
          sourceType: 'invalid'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Invalid sourceType');
    });
  });

  describe('POST /api/v1/tests/validate', () => {
    it('should return 400 if code is missing', async () => {
      const response = await request(app)
        .post('/api/v1/tests/validate')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Test code is required');
    });

    it('should successfully validate test code', async () => {
      const testCode = "test('example', async ({ page }) => {});";
      const response = await request(app)
        .post('/api/v1/tests/validate')
        .send({ code: testCode });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.validation).toBeDefined();
      expect(response.body.validation.valid).toBe(true);
    });
  });
});
