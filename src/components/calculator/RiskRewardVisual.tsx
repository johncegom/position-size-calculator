// Consider:
// - What data points are needed to visualize risk/reward ratio?
// - Would a chart library be useful here?
// - How can we visually represent the relationship between risk and potential reward?

import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { formatToTwoDecimals } from "../../utils/formatters";

const RATIO_THRESHOLDS = {
  GOOD: 2,
  DECENT: 1,
};

const RatioStatusBadge = ({ ratio }: { ratio: number }) => {
  const { GOOD, DECENT } = RATIO_THRESHOLDS;
  if (ratio >= GOOD) {
    return (
      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
        Excellent ratio
      </div>
    );
  } else if (ratio >= DECENT) {
    return (
      <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
        Acceptable ratio
      </div>
    );
  } else if (ratio > 0) {
    return (
      <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full">
        Improve your ratio
      </div>
    );
  }
  return (
    <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
      No data available
    </div>
  );
};

const RatioDisplay = ({ ratio }: { ratio: number }) => {
  const { GOOD, DECENT } = RATIO_THRESHOLDS;
  const getRatioTextColor = () => {
    if (ratio >= GOOD) return "text-green-600";
    if (ratio >= DECENT) return "text-yellow-600";
    if (ratio > 0) return "text-red-600";
    return "text-gray-600";
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
      <div>
        <p className="text-gray-600 text-sm mb-1">Risk/Reward Ratio</p>
        <p className={`text-2xl font-bold ${getRatioTextColor()}`}>
          {ratio ? `1:${formatToTwoDecimals(ratio)}` : "N/A"}
        </p>
      </div>
      <div className="mt-2 sm:mt-0 text-sm">
        <RatioStatusBadge ratio={ratio} />
      </div>
    </div>
  );
};

type ProgressBarType = {
  label: string;
  value: number;
  width: number;
  color: string;
};

const ProgressBar = ({ label, value, width, color }: ProgressBarType) => {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium">{label}</span>
        <span className={`text-sm font-bold ${color}`}>
          ${formatToTwoDecimals(value)}
        </span>
      </div>
      <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
        <div
          className={`h-full ${
            color === "text-red-600" ? "bg-red-500" : "bg-green-500"
          } rounded-lg transition-all duration-300 ease-out`}
          style={{ width: `${width}%` }}
        ></div>
      </div>
    </div>
  );
};

type PriceLevelCardType = {
  label: string;
  value: number | null;
  bgColor: string;
  borderColor: string;
};

const PriceLevelCard = ({
  label,
  value,
  bgColor,
  borderColor,
}: PriceLevelCardType) => {
  return (
    <div className={`${bgColor} ${borderColor} rounded-md p-2`}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="font-semibold">${value || "N/A"}</p>
    </div>
  );
};

const RiskRewardVisual = () => {
  const { calculationResult, tradeParameters } = useSelector(
    (state: RootState) => state.calculator
  );

  // Extract and calculate values for visualization
  const riskAmount = calculationResult?.potentialLoss || 0;
  const rewardAmount = calculationResult?.potentialProfit || 0;
  const ratio = calculationResult?.riskRewardRatio || 0;

  // Calculate bar widths (relative to each other)
  const maxValue = Math.max(riskAmount, rewardAmount);
  const riskWidth = maxValue > 0 ? (riskAmount / maxValue) * 100 : 0;
  const rewardWidth = maxValue > 0 ? (rewardAmount / maxValue) * 100 : 0;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Risk/Reward Analysis</h2>

      {/* Ratio display with color coding */}
      <RatioDisplay ratio={ratio} />

      {/* Visual comparison bars */}
      <div className="space-y-4 mb-6">
        {/* Risk visualization */}
        <ProgressBar
          label="Risk"
          value={riskAmount}
          width={riskWidth}
          color="text-red-600"
        />
        {/* Reward visualization */}
        <ProgressBar
          label="Potential Reward"
          value={rewardAmount}
          width={rewardWidth}
          color="text-green-600"
        />
      </div>

      {/* Price levels grid */}
      <div className="grid grid-cols-3 gap-2 text-center mt-6">
        <PriceLevelCard
          label="Stop Loss"
          value={tradeParameters.stopLossPrice}
          bgColor="bg-red-50"
          borderColor="border border-red-100 "
        />
        <PriceLevelCard
          label="Entry Price"
          value={tradeParameters.entryPrice}
          bgColor="bg-blue-50"
          borderColor="border border-blue-100"
        />

        <PriceLevelCard
          label="Take Profit"
          value={tradeParameters.takeProfitPrice}
          bgColor="bg-green-50"
          borderColor="border border-green-100"
        />
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
