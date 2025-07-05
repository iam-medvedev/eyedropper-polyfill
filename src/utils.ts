const prefix = `[EyeDropper]`;

/**
 * Errors text
 */
export const errors = {
  canvasError: `${prefix} Error getting canvas`,
  color: `${prefix} Cannot get color`,
};

/**
 * Returns px value
 */
export function px<T extends number>(value: T): `${T}px` {
  return `${value}px`;
}
