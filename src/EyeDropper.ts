import html2canvas from "html2canvas";

export class EyeDropperPolyfill implements EyeDropper {
  private previousDocumentCursor?: CSSStyleDeclaration["cursor"];
  private canvas?: HTMLCanvasElement;
  private canvasCtx?: CanvasRenderingContext2D;
  private lastObservedColor?: ColorSelectionResult;
  private resolve?: (result: ColorSelectionResult) => void;

  constructor() {
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  /**
   * Opens polyfilled eyedropper
   */
  public async open(
    options: ColorSelectionOptions
  ): Promise<ColorSelectionResult> {
    return new Promise(async (resolve) => {
      this.setWaitingCursor();
      await this.createScreenshot();
      this.revertWaitingCursor();

      this.resolve = resolve;
      this.bindEvents();
    });
  }

  /**
   * Creates fake screenshot of page and assign it to the body
   */
  private async createScreenshot() {
    const canvas = await html2canvas(document.documentElement, {
      allowTaint: true,
      useCORS: true,
      height: window.innerHeight,
      width: window.innerWidth,
    });

    Object.assign(canvas.style, {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 999999,
      userSelect: "none",
      pointerEvent: "none",
      // TODO: 0?
      // opacity: 1,
      width: "100%",
      height: "100%",
    });

    this.canvas = canvas;
    this.canvasCtx = this.canvas.getContext("2d");
    document.body.appendChild(canvas);
  }

  /**
   * Removes screenshot from page
   */
  private removeScreenshot() {
    document.body.removeChild(this.canvas);
    this.canvas = null;
  }

  /**
   * Sets waiting cursor
   */
  private setWaitingCursor() {
    this.previousDocumentCursor = document.documentElement.style.cursor;
    document.documentElement.style.cursor = "wait";
  }

  /**
   * Removes waiting cursor
   */
  private revertWaitingCursor() {
    document.documentElement.style.cursor = this.previousDocumentCursor;
    this.previousDocumentCursor = null;
  }

  /**
   * Binds events
   */
  private bindEvents() {
    window.addEventListener("mousemove", this.onMouseMove);
    window.addEventListener("click", this.onClick);
  }

  /**
   * Unbinds `mousemove` events
   */
  private unbindEvents() {
    window.removeEventListener("mousemove", this.onMouseMove);
    window.removeEventListener("click", this.onClick);
  }

  /**
   * `click` handler
   */
  private onClick() {
    this.unbindEvents();
    this.removeScreenshot();

    if (this.resolve) {
      this.resolve(this.lastObservedColor);
    }

    this.lastObservedColor = undefined;
  }

  /**
   * `mousemove` handler
   */
  private onMouseMove(event: MouseEvent) {
    const x = event.clientX * window.devicePixelRatio;
    const y = event.clientY * window.devicePixelRatio;

    if (!this.canvas || !this.canvasCtx) {
      throw new Error("Error getting canvas while using `EyeDropper` polyfill");
    }

    // Get the pixel data from the canvas
    const pixelData = this.canvasCtx.getImageData(x, y, 1, 1).data;
    this.lastObservedColor = this.extractColor(pixelData);
  }

  /**
   * Extracts RGB values from the pixel data
   */
  private extractColor(pixelData: ImageData["data"]): ColorSelectionResult {
    const red = pixelData[0];
    const green = pixelData[1];
    const blue = pixelData[2];

    const hex = ((1 << 24) + (red << 16) + (green << 8) + blue)
      .toString(16)
      .slice(1);

    return {
      sRGBHex: `#${hex}`,
    };
  }
}
