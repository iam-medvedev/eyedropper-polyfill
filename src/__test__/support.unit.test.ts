import { it, expect } from 'vitest';
import { isEyeDropperSupported } from '../support';
import { attachPolyfill } from '../attach';

it('successfully returns eyedropper support result', () => {
  expect(isEyeDropperSupported()).toEqual(false);
  attachPolyfill();
  expect(isEyeDropperSupported()).toEqual(true);
});
