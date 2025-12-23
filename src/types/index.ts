/**
 * Represents a platform integration (e.g., TestRail, Jira, etc.)
 */
export interface Integration {
  id: string;
  name: string;
  type: IntegrationType;
  enabled: boolean;
  config: IntegrationConfig;
}

export enum IntegrationType {
  TESTRAIL = 'testrail',
  JIRA = 'jira',
  JAMDEV = 'jamdev',
  FIGMA = 'figma',
  NOTION = 'notion',
  GITHUB = 'github',
  CONFLUENCE = 'confluence'
}

export interface IntegrationConfig {
  clientId?: string;
  clientSecret?: string;
  accessToken?: string;
  refreshToken?: string;
  apiUrl?: string;
  [key: string]: any;
}

/**
 * OAuth flow types
 */
export interface OAuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
}

/**
 * Playwright test types
 */
export interface PlaywrightTest {
  id: string;
  name: string;
  description?: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Natural language request for test generation
 */
export interface TestGenerationRequest {
  description: string;
  sourceType?: 'figma' | 'jira' | 'testrail' | 'manual';
  sourceId?: string;
  context?: Record<string, any>;
}
