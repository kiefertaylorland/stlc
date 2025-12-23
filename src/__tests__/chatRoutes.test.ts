import request from 'supertest';
import express, { Express } from 'express';
import chatRouter from '../routes/chat';

describe('Chat Routes', () => {
  let app: Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/v1/chat', chatRouter);
  });

  describe('POST /api/v1/chat', () => {
    it('should return 400 if message is missing', async () => {
      const response = await request(app)
        .post('/api/v1/chat')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Message is required');
    });

    it('should return 400 if message is not a string', async () => {
      const response = await request(app)
        .post('/api/v1/chat')
        .send({ message: 123 });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Message must be a string');
    });

    it('should return 400 if message exceeds max length', async () => {
      const longMessage = 'a'.repeat(5001);
      const response = await request(app)
        .post('/api/v1/chat')
        .send({ message: longMessage });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('must not exceed 5000 characters');
    });

    it('should successfully process a valid message', async () => {
      const response = await request(app)
        .post('/api/v1/chat')
        .send({ message: 'Hello LLM' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('response');
      expect(response.body).toHaveProperty('isLLMConfigured');
    });
  });

  describe('GET /api/v1/chat/status', () => {
    it('should return LLM configuration status', async () => {
      const response = await request(app)
        .get('/api/v1/chat/status');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('configured');
      expect(response.body).toHaveProperty('message');
    });
  });
});
