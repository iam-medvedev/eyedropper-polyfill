import { isEyeDropperSupported } from './support';
import { attachPolyfill } from './attach';

if (!isEyeDropperSupported()) {
  attachPolyfill();
}
