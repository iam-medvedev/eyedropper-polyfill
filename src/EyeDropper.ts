import { Magnifier } from "./Magnifier";
import { addCanvasStyle, errors, type Point } from "./utils";
import html2canvas from "html2canvas";

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
  private canvasCtx?: CanvasRenderingContext2D | null;
  private resolve?: (result: ColorSelectionResult) => void;
  private magnifier?: Magnifier;

  constructor() {
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  /**
   * Opens the polyfilled eyedropper
   *
   * §3.3 EyeDropper interface ► `open()`
   */
  public async open(
    options: ColorSelectionOptions = {}
  ): Promise<ColorSelectionResult> {
    // §3.3 EyeDropper interface ► `open()` ► p.2
    // Prevent opening if already open
    if (isOpenState.value) {
      return Promise.reject(
        new DOMException("Invalid state", "InvalidStateError")
      );
    }

    // §3.3 EyeDropper interface ► `open()` ► p.3
    // Create a promise to handle the color selection
    const result = new Promise<ColorSelectionResult>((resolve, reject) => {
      // §3.3 EyeDropper interface ► `open()` ► p.4
      // Handle possible signal abortion
      if (options.signal) {
        if (options.signal.aborted) {
          this.stop();

          return reject(
            options.signal.reason || new DOMException("Aborted", "AbortError")
          );
        }

        const abortListener = () => {
          this.stop();
          if (options.signal) {
            reject(
              options.signal.reason || new DOMException("Aborted", "AbortError")
            );
          }
        };

        options.signal.addEventListener("abort", abortListener);
      }

      // §3.3 EyeDropper interface ► `open()` ► p.5
      // Store the resolve function and start the eyedropper
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

    this.magnifier = new Magnifier(this.canvas);
  }

  /**
   * Stopping eyedropper mode
   */
  private stop() {
    this.unbindEvents();
    this.removeScreenshot();
    this.magnifier?.destroy();
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

    addCanvasStyle(this.canvas, "screenshot");
    this.canvasCtx = this.canvas.getContext("2d", {
      willReadFrequently: true,
    });
    document.body.appendChild(this.canvas);
  }

  /**
   * Removes screenshot from page
   */
  private removeScreenshot() {
    if (!this.canvas) {
      throw new Error(errors.canvasError);
    }

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
    if (this.previousDocumentCursor) {
      document.documentElement.style.cursor = this.previousDocumentCursor;
    } else {
      document.documentElement.style.cursor = "";
    }

    this.previousDocumentCursor = undefined;
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

    if (newValue && this.resolve) {
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
      throw new Error(errors.canvasError);
    }

    this.magnifier?.move({ x, y });
    this.detectColor({ x, y });
  }

  /**
   * Detects color from canvas data
   */
  private detectColor(point: Point) {
    if (!this.canvasCtx) {
      throw new Error(errors.canvasError);
    }

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
