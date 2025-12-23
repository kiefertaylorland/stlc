import { PlaywrightService } from '../services/PlaywrightService';

describe('PlaywrightService', () => {
  let service: PlaywrightService;

  beforeEach(() => {
    service = new PlaywrightService();
  });

  describe('generateTest', () => {
    it('should generate a test with basic template', async () => {
      const request = {
        description: 'Test login functionality'
      };

      const result = await service.generateTest(request);

      expect(result).toBeDefined();
      expect(result.name).toBe('Test login functionality');
      expect(result.description).toBe('Test login functionality');
      expect(result.code).toContain("test('Test login functionality'");
      expect(result.code).toContain('@playwright/test');
      expect(result.id).toMatch(/^test_\d+_/);
    });

    it('should include description in generated test', async () => {
      const request = {
        description: 'Navigate to homepage and verify title'
      };

      const result = await service.generateTest(request);

      expect(result.code).toContain('Navigate to homepage and verify title');
    });

    it('should sanitize quotes in description to prevent code injection', async () => {
      const request = {
        description: "Test with 'single' and \"double\" quotes"
      };

      const result = await service.generateTest(request);

      // Quotes should be removed from the test name in the code
      expect(result.code).toContain("test('Test with single and double quotes'");
      expect(result.code).not.toContain("'single'");
      expect(result.code).not.toContain('"double"');
    });
  });

  describe('validateTest', () => {
    it('should return valid for any test code', async () => {
      const code = "test('example', async ({ page }) => {});";
      
      const result = await service.validateTest(code);

      expect(result.valid).toBe(true);
      expect(result.errors).toBeUndefined();
    });
  });
});
