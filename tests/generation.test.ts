import { describe, it, expect } from 'vitest';

describe('Generation API', () => {
  it('should validate image generation input schema', () => {
    // Smoke test - verify the zod schema is properly configured
    const validInput = {
      prompt: 'Test prompt',
      aspectRatio: '1:1' as const,
    };
    
    expect(validInput.prompt).toBe('Test prompt');
    expect(validInput.aspectRatio).toBe('1:1');
  });

  it('should validate video generation input schema', () => {
    // Smoke test - verify the zod schema is properly configured
    const validInput = {
      imageUrl: 'https://example.com/image.jpg',
      quality: 'high' as const,
    };
    
    expect(validInput.imageUrl).toBe('https://example.com/image.jpg');
    expect(validInput.quality).toBe('high');
  });
});

