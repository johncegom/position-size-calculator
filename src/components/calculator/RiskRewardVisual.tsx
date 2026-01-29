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
          "text-teal-700 bg-teal-100 dark:bg-teal-900/50 dark:text-teal-300 ring-1 ring-teal-500/20",
        text: t("riskReward.excellentRatio"),
      },
      {
        condition: (r) => r >= DECENT,
        className:
          "text-yellow-700 bg-yellow-100 dark:bg-yellow-900/50 dark:text-yellow-300 ring-1 ring-yellow-500/20",
        text: t("riskReward.acceptableRatio"),
      },
      {
        condition: (r) => r > 0,
        className:
          "text-red-700 bg-red-100 dark:bg-red-900/50 dark:text-red-300 ring-1 ring-red-500/20",
        text: t("riskReward.improveRatio"),
      },
    ];
    return configs.find((cfg) => cfg.condition(ratio));
  }, [ratio, t, GOOD, DECENT]);

  if (badgeConfig) {
    return (
      <div
        className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${badgeConfig.className}`}
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
    return "text-gray-400 dark:text-gray-500";
  };

  return (
    <div className="flex flex-col items-start justify-between mb-8 sm:flex-row sm:items-center">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-widest dark:text-gray-400">
            {t("riskReward.ratio")}
          </p>
          <RatioStatusBadge ratio={ratio} />
        </div>
        <p
          className={`text-4xl font-bold font-mono tracking-tight ${getRatioTextColor()}`}
        >
          {ratio > 0 ? `1:${formatToTwoDecimals(ratio)}` : "--"}
        </p>
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

const ProgressBar = ({ label, value, width, color }: ProgressBarProps) => {
  const isRed = color.includes("red");
  const isEmptyReward = !isRed && value === 0;

  const barBg = isRed
    ? "bg-gradient-to-r from-red-500 to-red-400"
    : "bg-gradient-to-r from-teal-500 to-teal-400";

  const valueColor = isRed
    ? "text-red-600 dark:text-red-400"
    : isEmptyReward
      ? "text-gray-400 dark:text-gray-500"
      : "text-teal-600 dark:text-teal-400";

  return (
    <div className="relative">
      <div className="flex justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {label}
        </span>
        <span className={`text-sm font-bold ${valueColor} font-mono`}>
          {isEmptyReward ? "--" : `$${formatToTwoDecimals(value)}`}
        </span>
      </div>
      <div className="h-2.5 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-700/50">
        {!isEmptyReward && (
          <div
            className={`h-full ${barBg} rounded-full transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1)`}
            style={{
              width: `${Math.max(width, 2)}%`,
              boxShadow: isRed
                ? "0 0 10px rgba(239, 68, 68, 0.3)"
                : "0 0 10px rgba(20, 184, 166, 0.3)",
            }}
          ></div>
        )}
      </div>
    </div>
  );
};

type PriceLevelCardProps = {
  label: string;
  value: number | null;
  type: "neutral" | "risk" | "reward";
};

const PriceLevelCard = ({ label, value, type }: PriceLevelCardProps) => {
  const formatValue = value ? formatToEightDecimals(value) : null;

  let styles = "";
  let textStyles = "";

  switch (type) {
    case "risk":
      styles =
        "bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30";
      textStyles = "text-red-700 dark:text-red-400";
      break;
    case "reward":
      styles =
        "bg-teal-50/50 dark:bg-teal-900/10 border-teal-100 dark:border-teal-900/30";
      textStyles = "text-teal-700 dark:text-teal-400";
      break;
    default:
      styles =
        "bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/30";
      textStyles = "text-indigo-700 dark:text-indigo-400";
  }

  return (
    <div
      className={`border rounded-xl p-4 transition-all hover:scale-[1.02] ${styles}`}
    >
      <p
        className={`mb-1.5 text-[10px] font-bold tracking-widest uppercase opacity-70 ${textStyles}`}
      >
        {label}
      </p>
      <p className={`font-mono font-bold text-base truncate ${textStyles}`}>
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
  // Ensure bars are visible (min 5% if value > 0)
  const riskWidth = maxValue > 0 ? (riskAmount / maxValue) * 100 : 0;
  const rewardWidth = maxValue > 0 ? (rewardAmount / maxValue) * 100 : 0;

  return (
    <div className="p-8 glass-panel rounded-3xl h-full flex flex-col justify-between">
      <div>
        <h2 className="mb-6 text-xl font-bold text-gray-900 cursor-default dark:text-white font-display">
          {t("riskReward.title")}
        </h2>

        {/* Ratio display with color coding */}
        <RatioDisplay ratio={ratio} />

        {/* Visual comparison bars */}
        <div className="mb-10 space-y-8">
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <PriceLevelCard
            label={t("riskReward.stopLoss")}
            value={tradeParameters.stopLossPrice}
            type="risk"
          />
          <PriceLevelCard
            label={t("riskReward.entryPrice")}
            value={tradeParameters.entryPrice}
            type="neutral"
          />
          <PriceLevelCard
            label={t("riskReward.takeProfit")}
            value={tradeParameters.takeProfitPrice ?? null}
            type="reward"
          />
        </div>
      </div>
    </div>
  );
};

export default RiskRewardVisual;
