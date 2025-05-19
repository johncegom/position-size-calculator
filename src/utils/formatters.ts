// Questions to consider:
// - How should currency values be formatted?
// - How will percentages be displayed?
// - Should we use locale-specific formatting?
// - Would rounding be helpful for display values?

// TODO: Implement formatting utilities

// Utility functions for formatting values will be implemented later

export const formatToTwoDecimals = (value: number): number => {
  return parseFloat(value.toFixed(2));
};

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
