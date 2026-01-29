import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { formatToTwoDecimals } from "../../utils/formatters";
import { useTranslation } from "react-i18next";

const ResultDisplay = () => {
  const { calculationResult } = useSelector(
    (state: RootState) => state.calculator,
  );
  const { t } = useTranslation();

  if (!calculationResult) {
    return (
      <div className="p-8 text-center glass-panel rounded-2xl border-dashed border-2 border-gray-300 dark:border-gray-700 bg-transparent shadow-none">
        <h2 className="mb-2 text-xl font-bold text-gray-500 dark:text-gray-400 font-display">
          {t("calculator.resultsTitle")}
        </h2>
        <p className="text-gray-400 dark:text-gray-500">
          {t("calculator.noResults")}
        </p>
      </div>
    );
  }

  const { positionSize, potentialLoss, potentialProfit } = calculationResult;

  return (
    <div className="p-10 lg:p-12 glass-panel rounded-3xl relative overflow-hidden group">
      {/* Decorative gradient blob */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-primary/10 rounded-full blur-3xl group-hover:bg-brand-primary/20 transition-all duration-700"></div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
        <div>
          <h2 className="text-sm font-semibold tracking-widest text-text-secondary-light dark:text-text-secondary-dark uppercase mb-1">
            {t("calculator.resultsTitle")}
          </h2>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary font-mono tracking-tighter">
              ${formatToTwoDecimals(positionSize)}
            </span>
            <span className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
              {t("calculator.positionSize")}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {potentialLoss > 0 && (
          <div className="p-6 border border-red-200/50 shadow-sm rounded-2xl bg-gradient-to-br from-white to-red-50/30 dark:from-slate-800 dark:to-red-900/10 dark:border-red-500/10 backdrop-blur-sm">
            <p className="text-xs font-bold tracking-wider text-red-500/80 uppercase mb-2">
              {t("calculator.potentialLoss")}
            </p>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400 font-mono">
              ${formatToTwoDecimals(potentialLoss)}
            </p>
          </div>
        )}

        <div
          className={`p-6 border shadow-sm rounded-2xl transition-all ${
            potentialProfit > 0
              ? "border-emerald-200/50 bg-gradient-to-br from-white to-emerald-50/30 dark:from-slate-800 dark:to-emerald-900/10 dark:border-emerald-500/10"
              : "border-gray-200 bg-gray-50/50 dark:bg-slate-800/50 dark:border-gray-700/50"
          }`}
        >
          <p
            className={`text-xs font-bold tracking-wider uppercase mb-2 ${
              potentialProfit > 0
                ? "text-emerald-600/80 dark:text-emerald-400/80"
                : "text-gray-400 dark:text-gray-500"
            }`}
          >
            {t("calculator.potentialProfit")}
          </p>
          {potentialProfit > 0 ? (
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              ${formatToTwoDecimals(potentialProfit)}
            </p>
          ) : (
            <p className="text-2xl font-bold text-gray-300 dark:text-gray-600 font-mono italic">
              --
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
