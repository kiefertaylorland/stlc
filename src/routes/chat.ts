import { Router, Request, Response } from 'express';
import { LLMService } from '../services/LLMService';
import { config } from '../config/environment';

const router = Router();
const llmService = new LLMService(config.llm.endpoint, config.llm.model);

// Constants for validation
const MAX_MESSAGE_LENGTH = 5000;

/**
 * POST /api/v1/chat
 * Send a message to the LLM and get a response
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({
        error: 'Message is required'
      });
    }

    if (typeof message !== 'string') {
      return res.status(400).json({
        error: 'Message must be a string'
      });
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({
        error: `Message must not exceed ${MAX_MESSAGE_LENGTH} characters`
      });
    }

    const response = await llmService.chat(message, context);

    res.json({
      success: true,
      response,
      isLLMConfigured: llmService.isConfigured()
    });
  } catch (error: unknown) {
    console.error('Error processing chat message:', error);
    res.status(500).json({
      error: 'Failed to process chat message',
      ...(process.env.NODE_ENV !== 'production' && error instanceof Error && { details: error.message })
    });
  }
});

/**
 * GET /api/v1/chat/status
 * Check LLM configuration status
 */
router.get('/status', (req: Request, res: Response) => {
  res.json({
    configured: llmService.isConfigured(),
    message: llmService.isConfigured()
      ? 'LLM is configured and ready'
      : 'LLM is not configured. Set LLM_ENDPOINT and LLM_MODEL environment variables.'
  });
});

export default router;
