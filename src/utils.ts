export type Point = {
  x: number;
  y: number;
};

/**
 * Errors text
 */
export const errors = {
  canvasError: "Error getting canvas while using `EyeDropper` polyfill",
  magnifier: "Cannot create magnifier while using `EyeDropper` polyfill",
};

/**
 * Canvas styles creator
 */
export function addCanvasStyle(
  canvas: HTMLCanvasElement,
  type: "screenshot" | "magnifier"
) {
  Object.assign(canvas.style, {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999999 + (type === "screenshot" ? 1 : 2),
    userSelect: "none",
    pointerEvent: "none",
    opacity: type === "screenshot" ? 0 : 1,
    width: "100%",
    height: "100%",
  });
}
