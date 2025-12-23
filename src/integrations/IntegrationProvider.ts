import { IntegrationType, OAuthTokens, IntegrationConfig } from '../types';

/**
 * Base interface for all integration providers
 */
export abstract class IntegrationProvider {
  protected config: IntegrationConfig;
  
  constructor(config: IntegrationConfig) {
    this.config = config;
  }

  /**
   * Initialize OAuth flow
   */
  abstract getAuthorizationUrl(state: string): string;
  
  /**
   * Exchange authorization code for tokens
   */
  abstract exchangeCodeForTokens(code: string): Promise<OAuthTokens>;
  
  /**
   * Refresh access token
   */
  abstract refreshAccessToken(refreshToken: string): Promise<OAuthTokens>;
  
  /**
   * Validate connection
   */
  abstract validateConnection(): Promise<boolean>;
  
  /**
   * Get integration type
   */
  abstract getType(): IntegrationType;
}

/**
 * Factory for creating integration providers
 */
export class IntegrationFactory {
  static createProvider(type: IntegrationType, _config: IntegrationConfig): IntegrationProvider {
    // Placeholder - will be implemented with actual providers
    throw new Error(`Integration provider for ${type} not yet implemented`);
  }
}
