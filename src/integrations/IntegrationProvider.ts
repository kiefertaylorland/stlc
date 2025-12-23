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
 * Factory for creating integration providers.
 * 
 * TODO: Implement provider selection and instantiation once concrete
 * integration providers are added. The `_config` parameter is accepted
 * now so callers can be wired without changes, but it is intentionally
 * unused in this placeholder implementation.
 */
export class IntegrationFactory {
  /**
   * Placeholder factory method for creating integration providers.
   * 
   * @param type Integration type requested.
   * @param _config Integration configuration (currently unused in placeholder).
   * @throws {Error} Always, until integration providers are implemented.
   */
  static createProvider(type: IntegrationType, _config: IntegrationConfig): IntegrationProvider {
    // Placeholder - will be implemented with actual providers
    throw new Error(`Integration provider for ${type} not yet implemented`);
  }
}
