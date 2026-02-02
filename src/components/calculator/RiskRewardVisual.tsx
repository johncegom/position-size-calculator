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

const RatioDisplay = ({ ratio }: { ratio: number }) => {
  const { GOOD, DECENT } = RATIO_THRESHOLDS;
  const { t } = useTranslation();

  const getStatus = () => {
    if (ratio >= GOOD)
      return {
        color: "text-emerald-600 dark:text-emerald-400",
        bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
        borderColor: "border-emerald-200 dark:border-emerald-500/20",
        label: t("riskReward.excellentRatio"),
      };
    if (ratio >= DECENT)
      return {
        color: "text-amber-600 dark:text-amber-400",
        bgColor: "bg-amber-50 dark:bg-amber-500/10",
        borderColor: "border-amber-200 dark:border-amber-500/20",
        label: t("riskReward.acceptableRatio"),
      };
    if (ratio > 0)
      return {
        color: "text-rose-600 dark:text-rose-400",
        bgColor: "bg-rose-50 dark:bg-rose-500/10",
        borderColor: "border-rose-200 dark:border-rose-500/20",
        label: t("riskReward.improveRatio"),
      };
    return {
      color: "text-slate-400 dark:text-slate-500",
      bgColor: "bg-slate-50 dark:bg-slate-800/50",
      borderColor: "border-slate-200 dark:border-slate-700",
      label: t("riskReward.noData"),
    };
  };

  const status = getStatus();

  return (
    <div
      className={`group relative p-6 mb-8 rounded-3xl border ${status.borderColor} ${status.bgColor} transition-all duration-500 overflow-hidden`}
    >
      {/* Dynamic Background Gradient */}
      <div
        className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 opacity-50 -mr-16 -mt-16 rounded-full blur-3xl`}
      />

      <div className="relative z-10 flex flex-col justify-between h-full gap-4 sm:flex-row sm:items-end">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1">
            <div
              className={`w-2 h-2 rounded-full ${ratio > 0 ? "animate-pulse" : ""} bg-current ${status.color}`}
            />
            <h3 className="text-xs font-bold tracking-widest uppercase opacity-70 text-gray-600 dark:text-gray-300">
              {t("riskReward.ratio")}
            </h3>
          </div>

          <div className="flex items-baseline">
            <span className="text-6xl font-black tracking-tighter sm:text-7xl font-display">
              <span className="text-slate-900 dark:text-white">1</span>
              <span className="mx-1 text-slate-300 dark:text-slate-600">:</span>
              <span className={`${status.color}`}>
                {ratio > 0 ? formatToTwoDecimals(ratio) : "--"}
              </span>
            </span>
          </div>
        </div>

        <div
          className={`px-4 py-2 rounded-xl backdrop-blur-md bg-white/60 dark:bg-black/20 border border-white/20 shadow-sm ${status.color}`}
        >
          <p className="text-xs font-bold text-center uppercase tracking-wider">
            {status.label}
          </p>
        </div>
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
      <div className="flex flex-wrap justify-between items-baseline gap-2 mb-2">
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
      <p
        className={`font-mono font-bold text-sm sm:text-base break-all ${textStyles}`}
      >
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-center">
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
