import { Router, Request, Response } from 'express';
import { IntegrationType } from '../types';
import crypto from 'crypto';

const router = Router();

// In-memory store for OAuth state tokens
// NOTE: This is suitable for development but should be replaced with a distributed
// session store (e.g., Redis) for production deployments with multiple server instances
const oauthStates = new Map<string, { timestamp: number; type: string }>();

// Clean up expired states every 10 minutes
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [state, data] of oauthStates.entries()) {
    if (now - data.timestamp > 600000) { // 10 minutes
      oauthStates.delete(state);
    }
  }
}, 600000);

// Allow cleanup on module unload (for testing and shutdown)
if (cleanupInterval.unref) {
  cleanupInterval.unref();
}

// Export cleanup function for graceful shutdown
export const cleanupOAuthStates = () => {
  clearInterval(cleanupInterval);
  oauthStates.clear();
};

/**
 * GET /api/v1/integrations
 * List all available integrations
 */
router.get('/', (req: Request, res: Response) => {
  const integrations = [
    {
      type: IntegrationType.TESTRAIL,
      name: 'TestRail',
      description: 'Test case management platform',
      status: 'available',
      requiresOAuth: true
    },
    {
      type: IntegrationType.JIRA,
      name: 'Atlassian Jira',
      description: 'Issue and project tracking',
      status: 'available',
      requiresOAuth: true
    },
    {
      type: IntegrationType.JAMDEV,
      name: 'Jam.dev',
      description: 'Bug reporting and debugging',
      status: 'available',
      requiresOAuth: true
    },
    {
      type: IntegrationType.FIGMA,
      name: 'Figma',
      description: 'Design mockups and prototypes',
      status: 'available',
      requiresOAuth: true
    },
    {
      type: IntegrationType.NOTION,
      name: 'Notion',
      description: 'Documentation and knowledge base',
      status: 'available',
      requiresOAuth: true
    },
    {
      type: IntegrationType.GITHUB,
      name: 'GitHub',
      description: 'Code repository and CI/CD',
      status: 'available',
      requiresOAuth: true
    },
    {
      type: IntegrationType.CONFLUENCE,
      name: 'Confluence',
      description: 'Team documentation',
      status: 'available',
      requiresOAuth: true
    }
  ];

  res.json({ integrations });
});

/**
 * POST /api/v1/integrations/:type/authorize
 * Initialize OAuth flow for an integration
 */
router.post('/:type/authorize', (req: Request, res: Response) => {
  const { type } = req.params;
  
  // Generate CSRF protection state token
  const state = crypto.randomBytes(32).toString('hex');
  oauthStates.set(state, {
    timestamp: Date.now(),
    type
  });
  
  // Placeholder - will implement actual OAuth flow
  res.json({
    message: 'OAuth flow not yet implemented',
    type,
    state, // Return state token for CSRF protection
    nextSteps: [
      'Configure OAuth client ID and secret in environment variables',
      'Implement OAuth authorization URL generation with state parameter',
      'Handle OAuth callback with state validation'
    ]
  });
});

/**
 * POST /api/v1/integrations/:type/callback
 * Handle OAuth callback
 */
router.post('/:type/callback', (req: Request, res: Response) => {
  const { type } = req.params;
  const { code, state } = req.body;
  
  // Validate CSRF state token
  if (!state || !oauthStates.has(state)) {
    return res.status(400).json({
      error: 'Invalid or missing state parameter. Possible CSRF attack.'
    });
  }
  
  const storedState = oauthStates.get(state);
  oauthStates.delete(state); // One-time use
  
  if (storedState?.type !== type) {
    return res.status(400).json({
      error: 'State parameter type mismatch'
    });
  }
  
  // Additional CSRF protection: validate request origin/referer
  const origin = req.headers.origin;
  const referer = req.headers.referer;
  
  // In production, verify the origin/referer matches expected OAuth provider domains
  // This is a placeholder check - actual implementation should validate against
  // specific OAuth provider domains based on the integration type
  if (process.env.NODE_ENV === 'production') {
    if (!origin && !referer) {
      return res.status(400).json({
        error: 'Missing Origin and Referer headers. Possible CSRF attack.'
      });
    }
    // TODO: Add specific domain validation based on integration type
  }
  
  // Placeholder - will implement actual OAuth token exchange
  res.json({
    message: 'OAuth callback not yet implemented',
    type,
    receivedCode: !!code,
    stateValidated: true
  });
});

/**
 * DELETE /api/v1/integrations/:type
 * Disconnect an integration
 */
router.delete('/:type', (req: Request, res: Response) => {
  const { type } = req.params;
  
  res.json({
    message: `Integration ${type} disconnected`,
    type
  });
});

export default router;
