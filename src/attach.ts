import { EyeDropperClass } from "./EyeDropper";

export function attachPolyfill() {
  if (
    !Reflect.defineProperty(window, "EyeDropper", { value: EyeDropperClass })
  ) {
    throw Error(
      "Error attaching `EyeDropper` polyfill: couldn't attach `EyeDropper` to `window`"
    );
  }
}
