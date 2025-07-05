declare global {
  interface Window {
    EyeDropper: {
      new (): import('./src/types').EyeDropper;
    };
  }
}

export {};
