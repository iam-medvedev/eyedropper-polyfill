export class EyeDropperClass implements EyeDropper {
  constructor() {}

  public async open(
    options: ColorSelectionOptions
  ): Promise<ColorSelectionResult> {
    return {
      sRGBHex: "test",
    };
  }
}
