import { Router, Request, Response } from 'express';
import { PlaywrightService } from '../services/PlaywrightService';

const router = Router();
const playwrightService = new PlaywrightService();

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
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to generate test',
      message: error.message
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
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to validate test',
      message: error.message
    });
  }
});

export default router;
