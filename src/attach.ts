import { EyeDropperPolyfill } from './eyedropper';

/**
 * Attaches polyfill to the current window
 */
export function attachPolyfill() {
  if (!Reflect.defineProperty(window, 'EyeDropper', { value: EyeDropperPolyfill })) {
    throw Error("Error attaching `EyeDropper` polyfill: couldn't attach `EyeDropper` to `window`");
  }
}
