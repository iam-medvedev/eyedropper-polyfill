import { isEyeDropperSupported } from './support';
import { attachPolyfill } from './attach';
export * from './types';

if (typeof window !== 'undefined' && !isEyeDropperSupported()) {
  attachPolyfill();
}
