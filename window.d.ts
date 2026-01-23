declare global {
  interface Window {
    /**
     * EyeDropper API
     * @see https://wicg.github.io/eyedropper-api/#eyedropper
     */
    EyeDropper: {
      new (): import('./src/types').EyeDropper;
    };
  }
}

export {};
