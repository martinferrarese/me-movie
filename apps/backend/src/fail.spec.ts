import { describe, it, expect } from 'vitest';

describe('failing test', () => {
  it('should intentionally fail', () => {
    expect(true).toBe(false);
  });
});
