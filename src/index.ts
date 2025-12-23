import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/environment';
import { errorHandler } from './middleware/errorHandler';
import integrationsRouter from './routes/integrations';
import testsRouter from './routes/tests';
import chatRouter from './routes/chat';

const app: Express = express();

// Security middleware
app.use(helmet());

// Configure CORS with specific origins for production and restricted localhost origins for development
const devAllowedOrigins = process.env.DEV_ALLOWED_ORIGINS?.split(',').map(origin => origin.trim()).filter(Boolean) || [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];

const corsOptions = {
  origin: config.nodeEnv === 'production' 
    ? process.env.ALLOWED_ORIGINS?.split(',') || false
    : devAllowedOrigins,
  credentials: true
};
app.use(cors(corsOptions));

// Body parsing middleware with size limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later.'
});

// Health check rate limiter (less restrictive)
const healthLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  standardHeaders: true,
  legacyHeaders: false
});

// Apply rate limiting to API routes
app.use('/api/', limiter);

// Health check endpoint with rate limiting
app.get('/health', healthLimiter, (req: Request, res: Response) => {
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
const server = app.listen(PORT, () => {
  console.log(`🚀 STLC Testing Tool server running on port ${PORT}`);
  console.log(`📊 Environment: ${config.nodeEnv}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown handling
const gracefulShutdown = (signal: string) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
  
  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;
