import { Router, Request, Response } from 'express';
import { LLMService } from '../services/LLMService';
import { config } from '../config/environment';

const router = Router();
const llmService = new LLMService(config.llm.endpoint, config.llm.model);

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

    const response = await llmService.chat(message, context);

    res.json({
      success: true,
      response,
      isLLMConfigured: llmService.isConfigured()
    });
  } catch (error: any) {
    const responseBody: { error: string; details?: string } = {
      error: 'Failed to process chat message'
    };

    if (process.env.NODE_ENV !== 'production' && error && error.message) {
      responseBody.details = String(error.message);
    }

    res.status(500).json(responseBody);
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
