import { test, expect, describe } from "vitest";
import {
  formatToTwoDecimals,
  formatToEightDecimals,
  convertToDecimal,
  normalizePercentage,
} from "./formatters";

describe("formatters", () => {
  describe("formatToTwoDecimals", () => {
    test("rounds 1.234 to 1.23", () => {
      expect(formatToTwoDecimals(1.234)).toBe(1.23);
    });

    test("rounds 1.235 to 1.24", () => {
      expect(formatToTwoDecimals(1.235)).toBe(1.24);
    });

    test("handles zero", () => {
      expect(formatToTwoDecimals(0)).toBe(0);
    });

    test("handles negative numbers", () => {
      expect(formatToTwoDecimals(-1.236)).toBe(-1.24);
    });
  });

  describe("formatToEightDecimals", () => {
    test("returns '0' for zero", () => {
      expect(formatToEightDecimals(0)).toBe("0");
    });

    test("formats small numbers correctly", () => {
      expect(formatToEightDecimals(0.00001234)).toBe("0.00001234");
    });

    test("trims trailing zeros", () => {
      expect(formatToEightDecimals(1.5)).toBe("1.5");
    });

    test("removes decimal point if only zeros follow", () => {
      expect(formatToEightDecimals(2.0)).toBe("2");
    });

    test("handles up to 8 decimals", () => {
      expect(formatToEightDecimals(1.23456789123)).toBe("1.23456789");
    });
  });

  describe("convertToDecimal", () => {
    test("converts 25 to 0.25", () => {
      expect(convertToDecimal(25)).toBe(0.25);
    });

    test("converts 1 to 0.01", () => {
      expect(convertToDecimal(1)).toBe(0.01);
    });

    test("converts 0 to 0", () => {
      expect(convertToDecimal(0)).toBe(0);
    });
  });

  describe("normalizePercentage", () => {
    test("converts raw percentage (>1) to decimal", () => {
      expect(normalizePercentage(50)).toBe(0.5);
    });

    test("keeps decimal value (<=1) as is", () => {
      expect(normalizePercentage(0.5)).toBe(0.5);
    });

    test("handles edge case 1 as decimal", () => {
      expect(normalizePercentage(1)).toBe(1);
    });

    test("handles edge case 1.1 as raw percentage", () => {
      expect(normalizePercentage(1.1)).toBeCloseTo(0.011, 3);
    });
  });
});
