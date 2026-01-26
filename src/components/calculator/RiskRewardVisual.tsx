// Consider:
// - What data points are needed to visualize risk/reward ratio?
// - Would a chart library be useful here?
// - How can we visually represent the relationship between risk and potential reward?

import { useMemo } from "react";
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

  const badgeConfig = useMemo(() => {
    const configs: BadgeConfig[] = [
      {
        condition: (r) => r >= GOOD,
        className:
          "text-teal-700 bg-teal-100 dark:bg-teal-900/50 dark:text-teal-300",
        text: t("riskReward.excellentRatio"),
      },
      {
        condition: (r) => r >= DECENT,
        className:
          "text-yellow-700 bg-yellow-100 dark:bg-yellow-900/50 dark:text-yellow-300",
        text: t("riskReward.acceptableRatio"),
      },
      {
        condition: (r) => r > 0,
        className:
          "text-red-700 bg-red-100 dark:bg-red-900/50 dark:text-red-300",
        text: t("riskReward.improveRatio"),
      },
    ];
    return configs.find((cfg) => cfg.condition(ratio));
  }, [ratio, t, GOOD, DECENT]);

  if (badgeConfig) {
    return (
      <div
        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${badgeConfig.className}`}
      >
        {badgeConfig.text}
      </div>
    );
  }

  return (
    <div className="px-3 py-1.5 text-gray-600 bg-gray-100 rounded-lg text-xs font-bold uppercase tracking-wider dark:text-gray-300 dark:bg-white/10">
      {t("riskReward.noData")}
    </div>
  );
};

const RatioDisplay = ({ ratio }: { ratio: number }) => {
  const { GOOD, DECENT } = RATIO_THRESHOLDS;
  const { t } = useTranslation();

  const getRatioTextColor = () => {
    if (ratio >= GOOD) return "text-teal-600 dark:text-teal-400";
    if (ratio >= DECENT) return "text-yellow-600 dark:text-yellow-400";
    if (ratio > 0) return "text-red-600 dark:text-red-400";
    return "text-gray-600 dark:text-gray-400";
  };

  return (
    <div className="flex flex-col items-start justify-between mb-6 sm:flex-row sm:items-center">
      <div>
        <p className="mb-1 text-sm text-gray-600 cursor-default dark:text-gray-200">
          {t("riskReward.ratio")}
        </p>
        <p className={`text-2xl font-bold ${getRatioTextColor()}`}>
          {ratio > 0 ? `1:${formatToTwoDecimals(ratio)}` : t("common.optional")}
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
  const isRed = color.includes("red");
  const isEmptyReward = !isRed && value === 0;

  const barBg = isRed
    ? "bg-red-500 dark:bg-red-500"
    : "bg-teal-500 dark:bg-teal-500";

  const valueColor = isRed
    ? "text-red-600 dark:text-red-400"
    : isEmptyReward
      ? "text-gray-400 dark:text-gray-500"
      : "text-teal-600 dark:text-teal-400";

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium cursor-default dark:text-gray-200">
          {label}
        </span>
        <span className={`text-sm font-bold ${valueColor} font-mono`}>
          {isEmptyReward ? "--" : `$${formatToTwoDecimals(value)}`}
        </span>
      </div>
      <div className="h-4 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-700/50">
        {!isEmptyReward && (
          <div
            className={`h-full ${barBg} rounded-full transition-all duration-500 ease-out`}
            style={{ width: `${width}%` }}
          ></div>
        )}
      </div>
    </div>
  );
};

type PriceLevelCardProps = {
  label: string;
  value: number | null;
  bgColor: string;
  borderColor: string;
  textColor: string;
};

const PriceLevelCard = ({
  label,
  value,
  bgColor,
  borderColor,
  textColor,
}: PriceLevelCardProps) => {
  const formatValue = value ? formatToEightDecimals(value) : null;

  return (
    <div
      className={`${bgColor} ${borderColor} rounded-xl p-4 transition-all hover:bg-opacity-70`}
    >
      <p
        className={`mb-1 text-xs font-bold tracking-wider uppercase opacity-80 ${textColor}`}
      >
        {label}
      </p>
      <p className={`font-mono font-bold text-lg ${textColor}`}>
        {formatValue ? `$${formatValue}` : "N/A"}
      </p>
    </div>
  );
};

const RiskRewardVisual = () => {
  const { calculationResult, tradeParameters } = useSelector(
    (state: RootState) => state.calculator,
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
    <div className="p-6 glass-panel rounded-2xl">
      <h2 className="mb-6 text-xl font-bold text-gray-900 cursor-default dark:text-white font-display">
        {t("riskReward.title")}
      </h2>

      {/* Ratio display with color coding */}
      <RatioDisplay ratio={ratio} />

      {/* Visual comparison bars */}
      <div className="mb-8 space-y-6">
        {/* Risk visualization */}
        <ProgressBar
          label={t("riskReward.risk")}
          value={riskAmount}
          width={riskWidth}
          color="text-red-500"
        />
        {/* Reward visualization */}
        <ProgressBar
          label={t("riskReward.potentialReward")}
          value={rewardAmount}
          width={rewardWidth}
          color="text-teal-500"
        />
      </div>

      {/* Price levels grid */}
      <p className="mb-3 text-sm font-semibold text-gray-500 uppercase dark:text-gray-400">
        {t("riskReward.keyLevels")}
      </p>
      <div className="grid grid-cols-3 gap-3 text-center">
        <PriceLevelCard
          label={t("riskReward.stopLoss")}
          value={tradeParameters.stopLossPrice}
          bgColor="bg-red-50 dark:bg-red-900/40"
          borderColor="border border-red-100 dark:border-red-500/30"
          textColor="text-red-700 dark:text-red-300"
        />
        <PriceLevelCard
          label={t("riskReward.entryPrice")}
          value={tradeParameters.entryPrice}
          bgColor="bg-indigo-50 dark:bg-indigo-900/40"
          borderColor="border border-indigo-100 dark:border-indigo-500/30"
          textColor="text-indigo-700 dark:text-indigo-300"
        />
        <PriceLevelCard
          label={t("riskReward.takeProfit")}
          value={tradeParameters.takeProfitPrice ?? null}
          bgColor="bg-teal-50 dark:bg-teal-900/40"
          borderColor="border border-teal-100 dark:border-teal-500/30"
          textColor="text-teal-700 dark:text-teal-300"
        />
      </div>

      {/* Trading tip */}
      <div className="p-4 mt-8 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 dark:border dark:border-indigo-800/50">
        <div className="flex items-start gap-3">
          <div className="p-1 mt-0.5 bg-indigo-100 rounded-full dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <p className="mb-1 text-sm font-bold text-indigo-900 dark:text-indigo-200">
              {t("riskReward.tradingTip")}
            </p>
            <p className="text-sm text-indigo-700 dark:text-indigo-300 leading-relaxed">
              {t("riskReward.tipText")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskRewardVisual;
