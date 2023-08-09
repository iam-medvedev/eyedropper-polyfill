import { EyeDropperPolyfill } from "./EyeDropper";

export function attachPolyfill() {
  if (
    !Reflect.defineProperty(window, "EyeDropper", { value: EyeDropperPolyfill })
  ) {
    throw Error(
      "Error attaching `EyeDropper` polyfill: couldn't attach `EyeDropper` to `window`"
    );
  }
}
