import type { TradeParameters, CalculationResult } from "../types";
import { convertToDecimal } from "./formatters";

// =========================
// Main Position Size Logic
// =========================

/**
 * Calculates the position size based on risk management parameters.
 *
 * @param {Object} params - The trade parameters
 * @param {number} params.totalCapital - The total capital available for trading
 * @param {number} params.riskPercentage - The percentage of capital willing to risk (e.g., 5 for 5%)
 * @param {number} params.entryPrice - The price at which the position will be entered
 * @param {number} params.stopLossPrice - The price at which the position will be exited to limit losses
 * @param {number} [params.takeProfitPrice] - The price at which the position will be exited to take profits (optional)
 *
 * @returns {CalculationResult} An object containing:
 *   - positionSize: The calculated position size
 *   - potentialProfit: The potential profit if takeprofit is reached
 *   - potentialLoss: The maximum amount that can be lost (equal to the risk amount)
 *   - riskRewardRatio: The ratio of potential profit to potential loss, formatted to two decimal places
 */
export function calculatePositionSize({
  totalCapital,
  riskPercentage,
  entryPrice,
  stopLossPrice,
  takeProfitPrice = null,
}: TradeParameters): CalculationResult {
  if (
    !isFinite(totalCapital) ||
    !isFinite(riskPercentage) ||
    !isFinite(entryPrice) ||
    !isFinite(stopLossPrice) ||
    totalCapital <= 0 ||
    riskPercentage <= 0 ||
    riskPercentage > 100 ||
    entryPrice <= 0 ||
    stopLossPrice <= 0
  ) {
    throw new Error(
      "All inputs must be positive numbers. Risk % must be between 0 and 100."
    );
  }

  if (entryPrice === stopLossPrice) {
    throw new Error("Entry price and stop loss price cannot be equal.");
  }

  const isLong = stopLossPrice < entryPrice;

  if (takeProfitPrice) {
    if (
      (isLong && takeProfitPrice < entryPrice) ||
      (!isLong && takeProfitPrice > entryPrice)
    ) {
      throw new Error(
        "Take profit price must be above entry price for long positions or below for short positions."
      );
    }
  }

  const maxLossAmount = riskAmount(totalCapital, riskPercentage); // e.g: maxloss is 5% of capital
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
}

// =========================
// Helper Calculation Functions
// =========================

/**
 * Calculates risk amount based on total capital and risk percentage.
 *
 * @param {number} totalCapital - The total capital available for investment
 * @param {number} riskPercentage - The percentage of capital to risk
 * @returns {number} The calculated risk amount
 */
function riskAmount(totalCapital: number, riskPercentage: number): number {
  return totalCapital * convertToDecimal(riskPercentage);
}

/**
 * Calculates the percentage difference between a stop-loss price and an entry price.
 *
 * @param stoplossPrice - The price at which a stop-loss order is set
 * @param entryPrice - The price at which the position was entered
 * @returns The formatted percentage difference between the stop-loss and entry prices,
 *          calculated as (|stoplossPrice - entryPrice| / entryPrice)
 */
function stoplossPercentage(stoplossPrice: number, entryPrice: number): number {
  if (stoplossPrice <= 0 || entryPrice <= 0) {
    throw new Error("Stop loss price and entry price must be positive numbers");
  }
  if (stoplossPrice === entryPrice) {
    throw new Error("Stop loss price cannot be equal to entry price");
  }

  const stoplossRange = priceDistance(stoplossPrice, entryPrice);
  return stoplossRange / entryPrice;
}

/**
 * Calculates the percentage difference between the take profit price and entry price.
 *
 * @param takeprofitPrice - The price at which profit will be taken, or undefined
 * @param entryPrice - The initial entry price of the position
 * @returns The percentage difference as a decimal value or 0 if takeprofitPrice is undefined
 */
function takeprofitPercentage(
  takeprofitPrice: number | null,
  entryPrice: number
): number {
  if (!takeprofitPrice) return 0;
  const takeprofitRange = priceDistance(takeprofitPrice, entryPrice);
  return takeprofitRange / entryPrice;
}

/**
 * Calculates the take profit price based on the entry price, stop loss price, and risk-reward ratio.
 *
 * @param entryPrice - The price at which the position is entered.
 * @param stopLossPrice - The price at which the stop loss is set.
 * @param riskRewardRatio - The desired risk-reward ratio (e.g., 2 for a 1:2 risk-reward).
 * @returns The calculated take profit price.
 */
export function calculateTakeProfitPrice(
  entryPrice: number,
  stopLossPrice: number,
  riskRewardRatio: number
): number {
  const stopLossDistance = priceDistance(stopLossPrice, entryPrice);
  const takeProfitDistance = stopLossDistance * riskRewardRatio;
  const isLong = stopLossPrice < entryPrice;
  const takeProfitPrice = isLong
    ? entryPrice + takeProfitDistance
    : entryPrice - takeProfitDistance;
  return takeProfitPrice;
}

/**
 * Calculates the absolute distance between two price values.
 *
 * @param beginPrice - The starting price value
 * @param endPrice - The ending price value
 * @returns The absolute difference between the two prices
 *
 * @throws {Error} When either price is not a positive number
 * @throws {Error} When both prices are equal
 */
function priceDistance(beginPrice: number, endPrice: number): number {
  if (beginPrice <= 0 || endPrice <= 0) {
    throw new Error("Either price must be positive numbers");
  }
  if (beginPrice === endPrice) {
    throw new Error("Both prices cannot be equal");
  }
  return Math.abs(beginPrice - endPrice);
}
