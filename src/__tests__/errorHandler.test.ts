import request from 'supertest';
import express, { Express } from 'express';
import { errorHandler } from '../middleware/errorHandler';

describe('Error Handler Middleware', () => {
  let app: Express;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    // Suppress console.error during tests
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should handle errors with default status code 500', async () => {
    app.get('/test-error', () => {
      throw new Error('Test error');
    });
    app.use(errorHandler);

    const response = await request(app).get('/test-error');

    expect(response.status).toBe(500);
    expect(response.body.error).toHaveProperty('message');
    expect(response.body.error).toHaveProperty('statusCode', 500);
  });

  it('should handle errors with custom status code', async () => {
    app.get('/test-error', () => {
      const error = new Error('Not found') as Error & { statusCode?: number };
      error.statusCode = 404;
      throw error;
    });
    app.use(errorHandler);

    const response = await request(app).get('/test-error');

    expect(response.status).toBe(404);
    expect(response.body.error.statusCode).toBe(404);
  });

  it('should not expose stack traces in production', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    app.get('/test-error', () => {
      throw new Error('Test error');
    });
    app.use(errorHandler);

    const response = await request(app).get('/test-error');

    expect(response.body.error).not.toHaveProperty('stack');

    process.env.NODE_ENV = originalEnv;
  });

  it('should expose stack traces in development', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    app.get('/test-error', () => {
      throw new Error('Test error');
    });
    app.use(errorHandler);

    const response = await request(app).get('/test-error');

    expect(response.body.error).toHaveProperty('stack');

    process.env.NODE_ENV = originalEnv;
  });
});
