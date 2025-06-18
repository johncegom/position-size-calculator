export const formatToTwoDecimals = (value: number): number => {
  return parseFloat(value.toFixed(2));
};

export const formatToEightDecimals = (value: number): string => {
  if (value === 0) return "0";

  // Always use toFixed to avoid scientific notation, then remove trailing zeros
  const fixed = value.toFixed(8);

  // Remove trailing zeros and decimal point if not needed
  return fixed.replace(/\.?0+$/, "");
};

/**
 * Converts a percentage value to its decimal representation.
 *
 * @param percentage - The percentage value to convert (e.g., 25 for 25%).
 * @returns The decimal equivalent of the percentage (e.g., 0.25 for 25%).
 */
export const convertToDecimal = (percentage: number) => {
  return percentage / 100;
};

export const isRawPercentage = (value: number): boolean => {
  return value > 1;
};

/**
 * Normalizes a percentage value.
 *
 * If the value is a raw percentage (e.g., 50 for 50%), it converts it to a decimal form (0.5).
 * If the value is already in decimal form (e.g., 0.5), it returns it as is.
 *
 * @param {number} value - The percentage value to normalize
 * @returns {number} The normalized percentage as a decimal
 *
 * @example
 * // returns 0.5
 * normalizePercentage(50);
 *
 * @example
 * // returns 0.5
 * normalizePercentage(0.5);
 */
export const normalizePercentage = (value: number): number => {
  return isRawPercentage(value) ? value / 100 : value;
};
