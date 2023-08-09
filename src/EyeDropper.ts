import html2canvas from "html2canvas";

type Point = {
  x: number;
  y: number;
};

/** Global `isOpen` state */
const isOpenState = {
  value: false,
};

/**
 * EyeDropper API polyfill
 * https://wicg.github.io/eyedropper-api/#dom-colorselectionoptions
 */
export class EyeDropperPolyfill implements EyeDropper {
  private colorSelectionResult?: ColorSelectionResult;
  private previousDocumentCursor?: CSSStyleDeclaration["cursor"];
  private canvas?: HTMLCanvasElement;
  private canvasCtx?: CanvasRenderingContext2D;
  private magnifier?: HTMLCanvasElement;
  private magnifierCtx?: CanvasRenderingContext2D;
  private resolve?: (result: ColorSelectionResult) => void;
  private magnification = 2;
  private magnifierRadius = 50;
  private magnifierBorderWidth = 2;

  constructor() {
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  /**
   * Opens polyfilled eyedropper
   *
   * §3.3 EyeDropper interface ► `open()`
   */
  public async open(
    options: ColorSelectionOptions = {}
  ): Promise<ColorSelectionResult> {
    // §3.3 EyeDropper interface ► `open()` ► p.2
    if (isOpenState.value) {
      return Promise.reject(
        new DOMException("Invalid state", "InvalidStateError")
      );
    }

    // §3.3 EyeDropper interface ► `open()` ► p.3
    const result = new Promise<ColorSelectionResult>((resolve, reject) => {
      // §3.3 EyeDropper interface ► `open()` ► p.4
      if (options.signal) {
        if (options.signal.aborted) {
          this.stop();

          return reject(
            options.signal.reason || new DOMException("Aborted", "AbortError")
          );
        }

        const abortListener = () => {
          this.stop();
          reject(
            options.signal.reason || new DOMException("Aborted", "AbortError")
          );
        };

        options.signal.addEventListener("abort", abortListener);
      }

      // §3.3 EyeDropper interface ► `open()` ► p.5
      this.resolve = resolve;
      this.start();
    });

    return result;
  }

  /**
   * Starting eyedropper mode
   */
  private async start() {
    this.setWaitingCursor();
    await this.createScreenshot();
    this.revertWaitingCursor();
    this.bindEvents();
  }

  /**
   * Stopping eyedropper mode
   */
  private stop() {
    this.unbindEvents();
    this.removeScreenshot();
    this.colorSelectionResult = undefined;
    isOpenState.value = false;
  }

  /**
   * Creates fake screenshot of page and assign it to the body
   */
  private async createScreenshot() {
    this.canvas = await html2canvas(document.documentElement, {
      allowTaint: true,
      useCORS: true,
      height: window.innerHeight,
      width: window.innerWidth,
    });

    this.addCanvasStyle(this.canvas, "screenshot");
    this.canvasCtx = this.canvas.getContext("2d");
    document.body.appendChild(this.canvas);
  }

  /**
   * Removes screenshot from page
   */
  private removeScreenshot() {
    document.body.removeChild(this.canvas);
    this.canvas = undefined;
    this.canvasCtx = undefined;
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
    const newValue = this.colorSelectionResult;
    this.stop();

    if (this.resolve) {
      this.resolve(newValue);
    }
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

    this.detectColor({ x, y });
  }

  private addCanvasStyle(
    canvas: HTMLCanvasElement,
    type: "screenshot" | "magnifier"
  ) {
    Object.assign(canvas.style, {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 999999 + type === "screenshot" ? 1 : 2,
      userSelect: "none",
      pointerEvent: "none",
      // TODO: 0?
      // opacity: 1,
      width: "100%",
      height: "100%",
    });
  }

  /**
   * Detects color from canvas data
   */
  private detectColor(point: Point) {
    const pixelData = this.canvasCtx.getImageData(point.x, point.y, 1, 1).data;

    const red = pixelData[0];
    const green = pixelData[1];
    const blue = pixelData[2];

    const hex = ((1 << 24) + (red << 16) + (green << 8) + blue)
      .toString(16)
      .slice(1);

    this.colorSelectionResult = {
      sRGBHex: `#${hex}`,
    };
  }
}
