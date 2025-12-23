import { Router, Request, Response } from 'express';
import { PlaywrightService } from '../services/PlaywrightService';

const router = Router();
const playwrightService = new PlaywrightService();

// Constants for validation
const MAX_DESCRIPTION_LENGTH = 2000;

/**
 * POST /api/v1/tests/generate
 * Generate a Playwright test from natural language description
 */
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { description, sourceType, sourceId, context } = req.body;

    if (!description) {
      return res.status(400).json({
        error: 'Description is required'
      });
    }

    if (typeof description !== 'string') {
      return res.status(400).json({
        error: 'Description must be a string'
      });
    }

    if (description.length > MAX_DESCRIPTION_LENGTH) {
      return res.status(400).json({
        error: `Description must not exceed ${MAX_DESCRIPTION_LENGTH} characters`
      });
    }

    const test = await playwrightService.generateTest({
      description,
      sourceType,
      sourceId,
      context
    });

    res.json({
      success: true,
      test
    });
  } catch (error: unknown) {
    console.error('Error generating test:', error);
    res.status(500).json({
      error: 'Failed to generate test',
      ...(process.env.NODE_ENV !== 'production' && error instanceof Error && { details: error.message })
    });
  }
});

/**
 * POST /api/v1/tests/validate
 * Validate Playwright test code
 */
router.post('/validate', async (req: Request, res: Response) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        error: 'Test code is required'
      });
    }

    const validation = await playwrightService.validateTest(code);

    res.json({
      success: true,
      validation
    });
  } catch (error: unknown) {
    console.error('Error validating test:', error);
    res.status(500).json({
      error: 'Failed to validate test',
      ...(process.env.NODE_ENV !== 'production' && error instanceof Error && { details: error.message })
    });
  }
});

export default router;
