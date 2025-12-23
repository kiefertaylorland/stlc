import { ChatContext, TestGenerationContext } from '../types';

/**
 * Service for interacting with open-source LLM
 * This will be the core of the agentic coding capabilities
 */
export class LLMService {
  private endpoint: string | undefined;
  private model: string | undefined;

  constructor(endpoint?: string, model?: string) {
    this.endpoint = endpoint;
    this.model = model;
  }

  /**
   * Send a chat message and get a response
   */
  async chat(message: string, _context?: ChatContext): Promise<string> {
    // Placeholder - will integrate with actual LLM API
    if (!this.endpoint) {
      return this.getMockResponse(message);
    }
    
    // TODO: Implement actual LLM API call
    return this.getMockResponse(message);
  }

  /**
   * Generate Playwright test code from natural language
   */
  async generatePlaywrightCode(description: string, context?: TestGenerationContext): Promise<string> {
    const prompt = this.buildTestGenerationPrompt(description, context);
    return await this.chat(prompt);
  }

  /**
   * Build prompt for test generation
   */
  private buildTestGenerationPrompt(description: string, context?: TestGenerationContext): string {
    let prompt = `Generate a Playwright test for the following requirement:\n\n${description}\n\n`;
    
    if (context) {
      try {
        // Sanitize context to prevent circular references and limit depth
        const sanitizedContext = this.sanitizeContext(context);
        prompt += `Context: ${JSON.stringify(sanitizedContext, null, 2)}\n\n`;
      } catch (error) {
        console.warn('Failed to serialize context:', error);
      }
    }
    
    prompt += `Please provide a complete Playwright test using TypeScript syntax.`;
    
    return prompt;
  }

  /**
   * Sanitize context to prevent circular references and limit sensitive data exposure
   */
  private sanitizeContext(context: TestGenerationContext): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {};
    
    if (context.requirements) {
      sanitized.requirements = context.requirements;
    }
    if (context.designUrl) {
      sanitized.designUrl = context.designUrl;
    }
    if (context.issueId) {
      sanitized.issueId = context.issueId;
    }
    // Only include safe metadata fields
    if (context.metadata) {
      sanitized.metadata = Object.keys(context.metadata).reduce((acc, key) => {
        // Exclude potentially sensitive fields
        if (!['token', 'secret', 'password', 'key'].some(s => key.toLowerCase().includes(s))) {
          acc[key] = context.metadata![key];
        }
        return acc;
      }, {} as Record<string, unknown>);
    }
    
    return sanitized;
  }

  /**
   * Mock response for when LLM is not configured
   */
  private getMockResponse(message: string): string {
    return `Mock LLM response for: "${message}"\n\nNote: Configure LLM_ENDPOINT and LLM_MODEL environment variables to use actual LLM.`;
  }

  /**
   * Check if LLM is configured
   */
  isConfigured(): boolean {
    return !!(this.endpoint && this.model);
  }
}
