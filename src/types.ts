declare global {
  interface Window {
    /**
     * EyeDropper API constructor
     * @see https://wicg.github.io/eyedropper-api/#eyedropper
     */
    EyeDropper: {
      new (): EyeDropper;
    };
  }
}

/**
 * Options for the color selection process
 * @see https://wicg.github.io/eyedropper-api/#colorselectionoptions-dictionary
 */
export interface ColorSelectionOptions {
  /**
   * An AbortSignal that allows to abort the open operation
   * @see https://wicg.github.io/eyedropper-api/#dom-colorselectionoptions-signal
   */
  signal?: AbortSignal;
}

/**
 * The result of a color selection
 * @see https://wicg.github.io/eyedropper-api/#colorselectionresult
 */
export interface ColorSelectionResult {
  /**
   * The selected color in sRGB hexadecimal format
   * @see https://wicg.github.io/eyedropper-api/#dom-colorselectionresult-srgbhex
   */
  sRGBHex: string;
}

/**
 * A tool that allows users to select a color from the pixels on their screen,
 * including the pixels rendered outside of the web page requesting the color data
 * @see https://wicg.github.io/eyedropper-api/
 */
export interface EyeDropper {
  /**
   * Opens the eye dropper and returns a promise that resolves with the selected color
   * @see https://wicg.github.io/eyedropper-api/#dom-eyedropper-open
   */
  open(options?: ColorSelectionOptions): Promise<ColorSelectionResult>;
}
