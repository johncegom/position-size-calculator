import type { TradeParameters, CalculationResult } from "../types";
import { normalizePercentage } from "./formatters";

/**
 * Creates a curried function to calculate risk amount based on total capital and risk percentage.
 *
 * @param {number} totalCapital - The total capital available for investment
 * @returns {Function} A function that takes a risk percentage and returns the calculated risk amount
 * @example
 * const calculateRisk = riskAmount(10000);
 * const amountAtRisk = calculateRisk(2); // 2% risk of 10000 = 200
 */
const riskAmount =
  (totalCapital: number) =>
  (riskPercentage: number): number => {
    return totalCapital * normalizePercentage(riskPercentage);
  };

/**
 * Calculates the absolute distance between two price values.
 *
 * @param beginPrice - The starting price value
 * @param endPrice - The ending price value
 * @returns The absolute difference between the two prices
 *
 * @throws {Error} When either price is not a positive number
 * @throws {Error} When both prices are equal
 *
 * @example
 * ```typescript
 * const distance = priceDistance(100, 120); // Returns 20
 * const distance2 = priceDistance(150, 130); // Returns 20
 * ```
 */
const priceDistance = (beginPrice: number, endPrice: number) => {
  if (beginPrice <= 0 || endPrice <= 0) {
    throw new Error("Either price must be positive numbers");
  }
  if (beginPrice === endPrice) {
    throw new Error("Both prices cannot be equal");
  }
  return Math.abs(beginPrice - endPrice);
};

/**
 * Calculates the percentage difference between a stop-loss price and an entry price.
 *
 * @param stoplossPrice - The price at which a stop-loss order is set
 * @param entryPrice - The price at which the position was entered
 * @returns The formatted percentage difference between the stop-loss and entry prices,
 *          calculated as (|stoplossPrice - entryPrice| / entryPrice)
 */
const stoplossPercentage = (stoplossPrice: number, entryPrice: number) => {
  if (stoplossPrice <= 0 || entryPrice <= 0) {
    throw new Error("Stop loss price and entry price must be positive numbers");
  }
  if (stoplossPrice === entryPrice) {
    throw new Error("Stop loss price cannot be equal to entry price");
  }

  const stoplossRange = priceDistance(stoplossPrice, entryPrice);
  return stoplossRange / entryPrice;
};

/**
 * Calculates the percentage difference between the take profit price and entry price.
 *
 * @param takeprofitPrice - The price at which profit will be taken, or undefined
 * @param entryPrice - The initial entry price of the position
 * @returns The percentage difference as a decimal value or 0 if takeprofitPrice is undefined
 */
const takeprofitPercentage = (
  takeprofitPrice: number | null,
  entryPrice: number
) => {
  if (!takeprofitPrice) return 0;
  const takeprofitRange = priceDistance(takeprofitPrice, entryPrice);
  return takeprofitRange / entryPrice;
};

export const calculateTakeProfitPrice = (
  entryPrice: number,
  stopLossPrice: number,
  riskRewardRatio: number
) => {
  const stopLossDistance = priceDistance(stopLossPrice, entryPrice);
  const takeProfitDistance = stopLossDistance * riskRewardRatio;
  const isLong = stopLossPrice < entryPrice;
  const takeProfitPrice = isLong
    ? entryPrice + takeProfitDistance
    : entryPrice - takeProfitDistance;
  return takeProfitPrice;
};

/**
 * Calculates the position size based on risk management parameters.
 *
 * @param {Object} params - The trade parameters
 * @param {number} params.totalCapital - The total capital available for trading
 * @param {number} params.riskPercentage - The percentage of capital willing to risk (e.g., 5 for 5%)
 * @param {number} params.entryPrice - The price at which the position will be entered
 * @param {number} params.stoplossPrice - The price at which the position will be exited to limit losses
 * @param {number} [params.takeprofitPrice] - The price at which the position will be exited to take profits (optional)
 *
 * @returns {CalculationResult} An object containing:
 *   - positionSize: The calculated position size
 *   - potentialProfit: The potential profit if takeprofit is reached
 *   - potentialLoss: The maximum amount that can be lost (equal to the risk amount)
 *   - riskRewardRatio: The ratio of potential profit to potential loss, formatted to two decimal places
 */
export const calculatePositionSize = ({
  totalCapital,
  riskPercentage,
  entryPrice,
  stopLossPrice,
  takeProfitPrice = null,
}: TradeParameters): CalculationResult => {
  const riskByPercent = riskAmount(totalCapital);
  const maxLossAmount = riskByPercent(riskPercentage); // e.g: maxloss is 5% of capital
  const stoplossPercent = stoplossPercentage(stopLossPrice, entryPrice);
  let potentialProfit = 0;
  let riskRewardRatio = 0;

  const positionSize = maxLossAmount / stoplossPercent;

  if (takeProfitPrice) {
    const takeprofitPercent = takeprofitPercentage(takeProfitPrice, entryPrice);
    potentialProfit = positionSize * takeprofitPercent;
    riskRewardRatio = takeprofitPercent / stoplossPercent;
  }

  return {
    positionSize: positionSize,
    potentialProfit: potentialProfit,
    potentialLoss: maxLossAmount,
    riskRewardRatio: riskRewardRatio,
  };
};
