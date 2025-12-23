import { LLMService } from '../services/LLMService';

describe('LLMService', () => {
  describe('without configuration', () => {
    let service: LLMService;

    beforeEach(() => {
      service = new LLMService();
    });

    it('should not be configured', () => {
      expect(service.isConfigured()).toBe(false);
    });

    it('should return mock response', async () => {
      const message = 'Hello LLM';
      const response = await service.chat(message);

      expect(response).toContain('Mock LLM response');
      expect(response).toContain(message);
      expect(response).toContain('Configure LLM_ENDPOINT');
    });

    it('should generate Playwright code with mock', async () => {
      const description = 'Test the login page';
      const response = await service.generatePlaywrightCode(description);

      expect(response).toContain('Mock LLM response');
      expect(response).toContain('Generate a Playwright test');
    });
  });

  describe('with configuration', () => {
    let service: LLMService;

    beforeEach(() => {
      service = new LLMService('http://localhost:8080', 'test-model');
    });

    it('should be configured', () => {
      expect(service.isConfigured()).toBe(true);
    });
  });
});
