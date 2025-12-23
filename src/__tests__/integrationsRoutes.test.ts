import request from 'supertest';
import express, { Express } from 'express';
import integrationsRouter from '../routes/integrations';

describe('Integrations Routes', () => {
  let app: Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/v1/integrations', integrationsRouter);
  });

  describe('GET /api/v1/integrations', () => {
    it('should return list of available integrations', async () => {
      const response = await request(app)
        .get('/api/v1/integrations');

      expect(response.status).toBe(200);
      expect(response.body.integrations).toBeDefined();
      expect(Array.isArray(response.body.integrations)).toBe(true);
      expect(response.body.integrations.length).toBeGreaterThan(0);
      
      const firstIntegration = response.body.integrations[0];
      expect(firstIntegration).toHaveProperty('type');
      expect(firstIntegration).toHaveProperty('name');
      expect(firstIntegration).toHaveProperty('description');
      expect(firstIntegration).toHaveProperty('status');
      expect(firstIntegration).toHaveProperty('requiresOAuth');
    });
  });

  describe('POST /api/v1/integrations/:type/authorize', () => {
    it('should return OAuth flow information with state token', async () => {
      const response = await request(app)
        .post('/api/v1/integrations/github/authorize');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('state');
      expect(response.body).toHaveProperty('type', 'github');
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/v1/integrations/:type/callback', () => {
    it('should return error if state is missing', async () => {
      const response = await request(app)
        .post('/api/v1/integrations/github/callback')
        .send({ code: 'test-code' });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('state parameter');
    });

    it('should return error if state is invalid', async () => {
      const response = await request(app)
        .post('/api/v1/integrations/github/callback')
        .send({ code: 'test-code', state: 'invalid-state' });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('state parameter');
    });

    it('should validate state token correctly', async () => {
      // First, get a valid state token
      const authorizeResponse = await request(app)
        .post('/api/v1/integrations/github/authorize');

      const state = authorizeResponse.body.state;

      // Then use it in the callback
      const callbackResponse = await request(app)
        .post('/api/v1/integrations/github/callback')
        .send({ code: 'test-code', state });

      expect(callbackResponse.status).toBe(200);
      expect(callbackResponse.body.stateValidated).toBe(true);
    });

    it('should reject mismatched integration type', async () => {
      // Get state for github
      const authorizeResponse = await request(app)
        .post('/api/v1/integrations/github/authorize');

      const state = authorizeResponse.body.state;

      // Try to use it for jira
      const callbackResponse = await request(app)
        .post('/api/v1/integrations/jira/callback')
        .send({ code: 'test-code', state });

      expect(callbackResponse.status).toBe(400);
      expect(callbackResponse.body.error).toContain('type mismatch');
    });
  });

  describe('DELETE /api/v1/integrations/:type', () => {
    it('should disconnect an integration', async () => {
      const response = await request(app)
        .delete('/api/v1/integrations/github');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body.type).toBe('github');
    });
  });
});
