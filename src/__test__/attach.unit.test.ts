import { it, expect } from 'vitest';
import { attachPolyfill } from '../attach';

it('successfully attaches polyfill', () => {
  expect(window.EyeDropper).toBeUndefined();
  attachPolyfill();
  expect(window.EyeDropper).toBeDefined();
});
