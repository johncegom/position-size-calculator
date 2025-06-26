import { test, expect, describe } from "vitest";
import { calculatePositionSize } from "./calculations";

describe("calculatePositionSize", () => {
  const validParams = {
    totalCapital: 200,
    entryPrice: 2450,
    stopLossPrice: 2185,
    riskPercentage: 5,
  };

  describe("returns object structure", () => {
    const paramsWithTakeProfit = { ...validParams, takeProfitPrice: 3245 };
    const result = calculatePositionSize(paramsWithTakeProfit);

    test("has positionSize property", () => {
      expect(result).toHaveProperty("positionSize");
    });
    test("has potentialProfit property", () => {
      expect(result).toHaveProperty("potentialProfit");
    });
    test("has potentialLoss property", () => {
      expect(result).toHaveProperty("potentialLoss");
    });
    test("has riskRewardRatio property", () => {
      expect(result).toHaveProperty("riskRewardRatio");
    });
  });

  describe("returns correct values without take profit", () => {
    const result = calculatePositionSize(validParams);

    test("positionSize is correct", () => {
      expect(result.positionSize).toBeCloseTo(92.45, 2);
    });

    test("potentialProfit is correct", () => {
      expect(result.potentialProfit).toBeCloseTo(0, 2);
    });

    test("potentialLoss is correct", () => {
      expect(result.potentialLoss).toBeCloseTo(10, 2);
    });

    test("riskRewardRatio is correct", () => {
      expect(result.riskRewardRatio).toBeCloseTo(0, 2);
    });
  });

  describe("returns correct values with take profit", () => {
    const paramsWithTakeProfit = { ...validParams, takeProfitPrice: 3245 };
    const result = calculatePositionSize(paramsWithTakeProfit);

    test("positionSize is correct", () => {
      expect(result.positionSize).toBeCloseTo(92.45, 2);
    });

    test("potentialProfit is correct", () => {
      expect(result.potentialProfit).toBeCloseTo(30, 2);
    });

    test("potentialLoss is correct", () => {
      expect(result.potentialLoss).toBeCloseTo(10, 2);
    });

    test("riskRewardRatio is correct", () => {
      expect(result.riskRewardRatio).toBeCloseTo(3, 2);
    });
  });

  test("throws error when entry price equals stop loss price", () => {
    const invalidParams = {
      ...validParams,
      stopLossPrice: validParams.entryPrice,
    };
    expect(() => calculatePositionSize(invalidParams)).toThrowError(
      "Entry price and stop loss price cannot be equal."
    );
  });

  describe("throws error for negative input values", () => {
    test("all negative values", () => {
      expect(() =>
        calculatePositionSize({
          totalCapital: -200,
          entryPrice: -2450,
          stopLossPrice: -2185,
          riskPercentage: -5,
        })
      ).toThrowError(
        "All inputs must be positive numbers. Risk % must be between 0 and 100."
      );
    });

    test("negative totalCapital", () => {
      expect(() =>
        calculatePositionSize({
          totalCapital: -200,
          entryPrice: 2450,
          stopLossPrice: 2185,
          riskPercentage: 5,
        })
      ).toThrowError(
        "All inputs must be positive numbers. Risk % must be between 0 and 100."
      );
    });

    test("negative entryPrice", () => {
      expect(() =>
        calculatePositionSize({
          totalCapital: 200,
          entryPrice: -2450,
          stopLossPrice: 2185,
          riskPercentage: 5,
        })
      ).toThrowError(
        "All inputs must be positive numbers. Risk % must be between 0 and 100."
      );
    });

    test("negative stopLossPrice", () => {
      expect(() =>
        calculatePositionSize({
          totalCapital: 200,
          entryPrice: 2450,
          stopLossPrice: -2185,
          riskPercentage: 5,
        })
      ).toThrowError(
        "All inputs must be positive numbers. Risk % must be between 0 and 100."
      );
    });
    test("negative riskPercentage", () => {
      expect(() =>
        calculatePositionSize({
          totalCapital: 200,
          entryPrice: 2450,
          stopLossPrice: 2185,
          riskPercentage: -5,
        })
      ).toThrowError(
        "All inputs must be positive numbers. Risk % must be between 0 and 100."
      );
    });

    test("negative totalCapital and stopLossPrice", () => {
      expect(() =>
        calculatePositionSize({
          totalCapital: -200,
          entryPrice: 2450,
          stopLossPrice: -2185,
          riskPercentage: 5,
        })
      ).toThrowError(
        "All inputs must be positive numbers. Risk % must be between 0 and 100."
      );
    });
  });

  describe("throws error for invalid risk percentage", () => {
    test("riskPercentage is 0", () => {
      const params = { ...validParams, riskPercentage: 0 };
      expect(() => calculatePositionSize(params)).toThrowError(
        "All inputs must be positive numbers. Risk % must be between 0 and 100."
      );
    });

    test("riskPercentage is greater than 100", () => {
      const params = { ...validParams, riskPercentage: 113 };
      expect(() => calculatePositionSize(params)).toThrowError(
        "All inputs must be positive numbers. Risk % must be between 0 and 100."
      );
    });
  });

  test("allows riskPercentage is exactly 100", () => {
    const params = { ...validParams, riskPercentage: 100 };
    const result = calculatePositionSize(params);
    expect(result.potentialLoss).toBeCloseTo(params.totalCapital, 2);
  });
});
