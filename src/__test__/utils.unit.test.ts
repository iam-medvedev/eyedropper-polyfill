import { it, expect } from 'vitest';
import { px } from '../utils';

it('returns px value', () => {
  expect(px(100)).toEqual('100px');
  expect(px(-100)).toEqual('-100px');
  expect(() => px(NaN)).toThrow();
  // @ts-expect-error for test
  expect(() => px('')).toThrow();
  // @ts-expect-error for test
  expect(() => px({})).toThrow();
});
