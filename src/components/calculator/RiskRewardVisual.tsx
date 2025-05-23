// Consider:
// - What data points are needed to visualize risk/reward ratio?
// - Would a chart library be useful here?
// - How can we visually represent the relationship between risk and potential reward?

import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

const RiskRewardVisual = () => {
  const { calculationResult, tradeParameters } = useSelector(
    (state: RootState) => state.calculator
  );

  // Extract and calculate values for visualization
  const riskAmount = calculationResult?.potentialLoss || 0;
  const rewardAmount = calculationResult?.potentialProfit || 0;
  const ratio = calculationResult?.riskRewardRatio || 0;

  // Determine ratio quality
  const isGoodRatio = ratio >= 2;
  const isDecentRatio = ratio >= 1 && ratio < 2;
  const isPoorRatio = ratio > 0 && ratio < 1;

  // Calculate bar widths (relative to each other)
  const maxValue = Math.max(riskAmount, rewardAmount);
  const riskWidth = maxValue > 0 ? (riskAmount / maxValue) * 100 : 0;
  const rewardWidth = maxValue > 0 ? (rewardAmount / maxValue) * 100 : 0;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Risk/Reward Analysis</h2>

      {/* Ratio display with color coding */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <div>
          <p className="text-gray-600 text-sm mb-1">Risk/Reward Ratio</p>
          <p
            className={`text-2xl font-bold ${
              isGoodRatio
                ? "text-green-600"
                : isDecentRatio
                ? "text-yellow-600"
                : isPoorRatio
                ? "text-red-600"
                : "text-gray-600"
            }`}
          >
            {ratio ? `1:${ratio.toFixed(2)}` : "N/A"}
          </p>
        </div>

        <div className="mt-2 sm:mt-0 text-sm">
          {isGoodRatio && (
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
              Excellent ratio
            </div>
          )}
          {isDecentRatio && (
            <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
              Acceptable ratio
            </div>
          )}
          {isPoorRatio && (
            <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full">
              Improve your ratio
            </div>
          )}
          {!ratio && (
            <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* Visual comparison bars */}
      <div className="space-y-4 mb-6">
        {/* Risk visualization */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Risk</span>
            <span className="text-sm font-bold text-red-600">
              ${riskAmount.toFixed(2)}
            </span>
          </div>
          <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
            <div
              className="h-full bg-red-500 rounded-lg transition-all duration-300 ease-out"
              style={{ width: `${riskWidth}%` }}
            ></div>
          </div>
        </div>

        {/* Reward visualization */}
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Potential Reward</span>
            <span className="text-sm font-bold text-green-600">
              ${rewardAmount.toFixed(2)}
            </span>
          </div>
          <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-lg transition-all duration-300 ease-out"
              style={{ width: `${rewardWidth}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Price levels grid */}
      <div className="grid grid-cols-3 gap-2 text-center mt-6">
        <div className="bg-red-50 border border-red-100 rounded-md p-2">
          <p className="text-xs text-gray-500 mb-1">Stop Loss</p>
          <p className="font-semibold">
            ${tradeParameters.stopLossPrice || "N/A"}
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-md p-2">
          <p className="text-xs text-gray-500 mb-1">Entry</p>
          <p className="font-semibold">
            ${tradeParameters.entryPrice || "N/A"}
          </p>
        </div>

        <div className="bg-green-50 border border-green-100 rounded-md p-2">
          <p className="text-xs text-gray-500 mb-1">Take Profit</p>
          <p className="font-semibold">
            ${tradeParameters.takeProfitPrice || "N/A"}
          </p>
        </div>
      </div>

      {/* Trading tip */}
      <div className="mt-6 bg-blue-50 border border-blue-100 rounded-md p-3 text-xs text-gray-700">
        <p className="font-medium mb-1">💡 Trading Tip:</p>
        <p>
          Professional traders typically aim for a risk/reward ratio of at least
          1:2 or better. This means risking $1 to potentially gain $2, improving
          your chances of long-term profitability.
        </p>
      </div>
    </div>
  );
};

export default RiskRewardVisual;
