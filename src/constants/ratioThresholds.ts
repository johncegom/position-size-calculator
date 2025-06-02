export const RATIO_THRESHOLDS = {
  GOOD: 2,
  DECENT: 1,
} as const;

export type RatioThreshold =
  (typeof RATIO_THRESHOLDS)[keyof typeof RATIO_THRESHOLDS];
