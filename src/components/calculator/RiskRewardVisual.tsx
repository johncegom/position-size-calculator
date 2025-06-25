// Consider:
// - What data points are needed to visualize risk/reward ratio?
// - Would a chart library be useful here?
// - How can we visually represent the relationship between risk and potential reward?

import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import {
  formatToEightDecimals,
  formatToTwoDecimals,
} from "../../utils/formatters";
import { useTranslation } from "react-i18next";
import { RATIO_THRESHOLDS } from "../../constants/ratioThresholds";

const RatioStatusBadge = ({ ratio }: { ratio: number }) => {
  const { GOOD, DECENT } = RATIO_THRESHOLDS;
  const { t } = useTranslation();

  type BadgeConfig = {
    condition: (ratio: number) => boolean;
    className: string;
    text: string;
  };

  const badgeConfigs: BadgeConfig[] = [
    {
      condition: (ratio) => ratio >= GOOD,
      className:
        "text-green-800  bg-green-100 dark:bg-green-700 dark:text-green-100",
      text: t("riskReward.excellentRatio"),
    },
    {
      condition: (ratio) => ratio >= DECENT,
      className:
        "text-yellow-800 bg-yellow-100 dark:bg-yellow-700 dark:text-yellow-100",
      text: t("riskReward.acceptableRatio"),
    },
    {
      condition: (ratio) => ratio > 0,
      className: "text-red-800 bg-red-100 dark:bg-red-700 dark:text-red-100 ",
      text: t("riskReward.improveRatio"),
    },
  ];

  const config = badgeConfigs.find((cfg) => {
    return cfg.condition(ratio);
  });

  if (config) {
    return (
      <div className={`px-3 py-1 rounded-full ${config.className}`}>
        {config.text}
      </div>
    );
  }

  return (
    <div className="px-3 py-1 text-gray-600 bg-gray-100 rounded-full dark:text-gray-200 dark:bg-gray-700">
      {t("riskReward.noData")}
    </div>
  );
};

const RatioDisplay = ({ ratio }: { ratio: number }) => {
  const { GOOD, DECENT } = RATIO_THRESHOLDS;
  const { t } = useTranslation();

  const getRatioTextColor = () => {
    if (ratio >= GOOD) return "text-green-600 dark:text-green-400";
    if (ratio >= DECENT) return "text-yellow-600 dark:text-yellow-400";
    if (ratio > 0) return "text-red-600 dark:text-red-400";
    return "text-gray-600 dark:text-gray-200";
  };

  return (
    <div className="flex flex-col items-start justify-between mb-6 sm:flex-row sm:items-center">
      <div>
        <p className="mb-1 text-sm text-gray-600 cursor-default dark:text-gray-200">
          {t("riskReward.ratio")}
        </p>
        <p className={`text-2xl font-bold ${getRatioTextColor()}`}>
          {ratio ? `1:${formatToTwoDecimals(ratio)}` : "N/A"}
        </p>
      </div>
      <div className="mt-2 text-sm cursor-default sm:mt-0">
        <RatioStatusBadge ratio={ratio} />
      </div>
    </div>
  );
};

type ProgressBarProps = {
  label: string;
  value: number;
  width: number;
  color: string;
};

/**
 * A progress bar component that displays a labeled value with a visual bar representation.
 *
 * @param props - The properties for the ProgressBar component
 * @param props.label - The text label displayed above the progress bar
 * @param props.value - The numeric value to display, formatted to 8 decimal places with currency symbol
 * @param props.width - The width percentage (0-100) that determines how much of the bar is filled
 * @param props.color - The text color class for the value display, also determines bar color (red for "text-red-600", green otherwise)
 *
 * @returns A JSX element containing a labeled progress bar with formatted value display
 */
const ProgressBar = ({ label, value, width, color }: ProgressBarProps) => {
  const barBg =
    color === "text-red-600"
      ? "bg-red-500 dark:bg-red-700"
      : "bg-green-500 dark:bg-green-700";
  const textColor =
    color === "text-red-600"
      ? "text-red-600 dark:text-red-400"
      : "text-green-600 dark:text-green-400";
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium cursor-default dark:text-gray-200">
          {label}
        </span>
        <span className={`text-sm font-bold ${textColor}`}>
          ${formatToTwoDecimals(value)}
        </span>
      </div>
      <div className="h-8 overflow-hidden bg-gray-100 rounded-lg dark:bg-gray-700">
        <div
          className={`h-full ${barBg} rounded-lg transition-all duration-300 ease-out`}
          style={{ width: `${width}%` }}
        ></div>
      </div>
    </div>
  );
};

type PriceLevelCardProps = {
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
}: PriceLevelCardProps) => {
  const formatValue = value ? formatToEightDecimals(value) : null;
  // Add dark mode classes for bg and border
  const darkBg =
    bgColor === "bg-red-50"
      ? "dark:bg-red-900"
      : bgColor === "bg-blue-50"
      ? "dark:bg-blue-900"
      : "dark:bg-green-900";
  const darkBorder =
    borderColor === "border border-red-100"
      ? "dark:border-red-900"
      : borderColor === "border border-blue-100"
      ? "dark:border-blue-900"
      : "dark:border-green-900";
  return (
    <div
      className={`${bgColor} ${borderColor} ${darkBg} ${darkBorder} rounded-md p-2`}
    >
      <p className="mb-1 text-xs text-gray-500 cursor-default dark:text-gray-200">
        {label}
      </p>
      <p className="font-semibold text-gray-900 dark:text-gray-50">
        {formatValue ? `$${formatValue}` : "N/A"}
      </p>
    </div>
  );
};

const RiskRewardVisual = () => {
  const { calculationResult, tradeParameters } = useSelector(
    (state: RootState) => state.calculator
  );
  const { t } = useTranslation();

  // Extract and calculate values for visualization
  const riskAmount = calculationResult?.potentialLoss || 0;
  const rewardAmount = calculationResult?.potentialProfit || 0;
  const ratio = calculationResult?.riskRewardRatio || 0;

  // Calculate bar widths (relative to each other)
  const maxValue = Math.max(riskAmount, rewardAmount);
  const riskWidth = maxValue > 0 ? (riskAmount / maxValue) * 100 : 0;
  const rewardWidth = maxValue > 0 ? (rewardAmount / maxValue) * 100 : 0;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:shadow-[0_2px_16px_0_rgba(255,255,255,0.08)]">
      <h2 className="mb-4 text-xl font-semibold text-gray-900 cursor-default dark:text-gray-50">
        {t("riskReward.title")}
      </h2>

      {/* Ratio display with color coding */}
      <RatioDisplay ratio={ratio} />

      {/* Visual comparison bars */}
      <div className="mb-6 space-y-4">
        {/* Risk visualization */}
        <ProgressBar
          label={t("riskReward.risk")}
          value={riskAmount}
          width={riskWidth}
          color="text-red-600"
        />
        {/* Reward visualization */}
        <ProgressBar
          label={t("riskReward.potentialReward")}
          value={rewardAmount}
          width={rewardWidth}
          color="text-green-600"
        />
      </div>

      {/* Price levels grid */}
      <div className="grid grid-cols-3 gap-2 mt-6 text-center">
        <PriceLevelCard
          label={t("riskReward.stopLoss")}
          value={tradeParameters.stopLossPrice}
          bgColor="bg-red-50"
          borderColor="border border-red-100"
        />
        <PriceLevelCard
          label={t("riskReward.entryPrice")}
          value={tradeParameters.entryPrice}
          bgColor="bg-blue-50"
          borderColor="border border-blue-100"
        />
        <PriceLevelCard
          label={t("riskReward.takeProfit")}
          value={tradeParameters.takeProfitPrice}
          bgColor="bg-green-50"
          borderColor="border border-green-100"
        />
      </div>

      {/* Trading tip */}
      <div className="p-3 mt-6 text-xs text-gray-700 border border-blue-100 rounded-md dark:text-gray-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950">
        <p className="mb-1 font-medium cursor-default">
          {t("riskReward.tradingTip")}
        </p>
        <p>{t("riskReward.tipText")}</p>
      </div>
    </div>
  );
};

export default RiskRewardVisual;
