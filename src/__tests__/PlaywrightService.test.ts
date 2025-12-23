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

    it('should escape single quotes in description to prevent code injection', async () => {
      const request = {
        description: "Test with 'single quotes'"
      };

      const result = await service.generateTest(request);

      // Single quotes should be escaped
      expect(result.code).toContain("test('Test with \\'single quotes\\''");
    });

    it('should escape backslashes in description', async () => {
      const request = {
        description: "Test with \\ backslash"
      };

      const result = await service.generateTest(request);

      // Backslashes should be escaped
      expect(result.code).toContain('\\\\');
    });

    it('should replace newlines with spaces in description', async () => {
      const request = {
        description: "Test with\nmultiple\nlines"
      };

      const result = await service.generateTest(request);

      // Newlines in the description should be replaced with spaces
      expect(result.code).toContain("test('Test with multiple lines'");
      // The test name should not have newlines
      const testNameMatch = result.code.match(/test\('([^']+)'/);
      expect(testNameMatch).toBeDefined();
      expect(testNameMatch![1]).not.toContain('\n');
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
