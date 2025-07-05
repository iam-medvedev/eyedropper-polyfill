export interface ColorSelectionOptions {
  signal?: AbortSignal;
}

export interface ColorSelectionResult {
  sRGBHex: string;
}

export interface EyeDropper {
  open(options?: ColorSelectionOptions): Promise<ColorSelectionResult>;
}
