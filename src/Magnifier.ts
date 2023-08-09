import { addCanvasStyle, errors, type Point } from "./utils";

/**
 * Creates a magnifying glass effect
 */
export class Magnifier {
  private originalCanvas: HTMLCanvasElement;
  private canvas: HTMLCanvasElement;
  private canvasCtx: CanvasRenderingContext2D;
  private magnification = 10;
  private radius = 120;

  constructor(originalCanvas?: HTMLCanvasElement) {
    if (!originalCanvas) {
      throw new Error(errors.magnifier);
    }

    this.originalCanvas = originalCanvas;
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.originalCanvas.width;
    this.canvas.height = this.originalCanvas.height;
    addCanvasStyle(this.canvas, "magnifier");
    document.body.append(this.canvas);
    const ctx = this.canvas.getContext("2d", {
      willReadFrequently: true,
    });
    if (!ctx) {
      throw new Error(errors.canvasError);
    }
    this.canvasCtx = ctx;
    this.canvasCtx.drawImage(this.originalCanvas, 0, 0);
  }

  /**
   * Moves magnifier
   */
  public move(point: Point) {
    this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Save the magnifier context state
    this.canvasCtx.save();

    // Create a circular clipping path for the magnifier canvas
    this.canvasCtx.beginPath();
    this.canvasCtx.arc(point.x, point.y, this.radius, 0, 2 * Math.PI);
    this.canvasCtx.clip();

    // Draw the zoomed-in image section on the magnifier canvas
    // Calculate the position of the zoomed-in area on the original image
    const sourceX = point.x - this.radius / this.magnification;
    const sourceY = point.y - this.radius / this.magnification;
    const sourceWidth = (this.radius * 2) / this.magnification;
    const sourceHeight = (this.radius * 2) / this.magnification;

    // Draw the zoomed-in image section inside the clipped area
    this.canvasCtx.drawImage(
      this.originalCanvas,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      point.x - this.radius,
      point.y - this.radius,
      this.radius * 2,
      this.radius * 2
    );

    // Restore the magnifier context state
    this.canvasCtx.restore();

    // Draw the magnifier circle
    this.canvasCtx.strokeStyle = "#665F75";
    this.canvasCtx.lineWidth = 2;
    this.canvasCtx.beginPath();
    this.canvasCtx.arc(point.x, point.y, this.radius, 0, 2 * Math.PI);
    this.canvasCtx.stroke();
  }

  /**
   * Instance cleanup
   */
  public destroy() {
    document.body.removeChild(this.canvas);
  }
}
