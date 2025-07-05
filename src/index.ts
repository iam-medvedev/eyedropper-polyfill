import { isEyeDropperSupported } from './support';
import { attachPolyfill } from './attach';
export * from './types';

if (!isEyeDropperSupported()) {
  attachPolyfill();
}
