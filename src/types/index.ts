// Questions to consider for TradeParameters:
// - What price information is needed for entry, exit and stop points?
// - How should we represent a trader's capital and risk tolerance?
// - Should we include any additional parameters like asset type or leverage?

export interface TradeParameters {
  totalCapital: number;
  riskPercentage: number;
  entryPrice: number;
  stoplossPrice: number;
  takeprofitPrice?: number;
}

// Questions to consider for CalculationResult:
// - What information should be returned after calculation?
// - How to represent position sizing?
// - What metrics are important for risk/reward visualization?
// - Would including percentage values be helpful?

export interface CalculationResult {
  positionSize: number;
  potentialLoss: number;
  potentialProfit: number;
  riskRewardRatio: number;
}
