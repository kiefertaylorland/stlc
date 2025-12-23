import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/environment';
import { errorHandler } from './middleware/errorHandler';
import integrationsRouter from './routes/integrations';
import testsRouter from './routes/tests';
import chatRouter from './routes/chat';

const app: Express = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Body parsing middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'STLC Testing Tool'
  });
});

// API Routes
app.get('/api/v1/status', (req: Request, res: Response) => {
  res.json({
    message: 'STLC Testing Tool API',
    version: '0.1.0',
    features: {
      integrations: ['TestRail', 'Jira', 'Jam.dev', 'Figma', 'Notion', 'GitHub', 'Confluence'],
      capabilities: ['Natural Language Chat', 'Playwright Test Authoring', 'Agentic Coding']
    }
  });
});

// Mount route handlers
app.use('/api/v1/integrations', integrationsRouter);
app.use('/api/v1/tests', testsRouter);
app.use('/api/v1/chat', chatRouter);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 STLC Testing Tool server running on port ${PORT}`);
  console.log(`📊 Environment: ${config.nodeEnv}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});

export default app;
