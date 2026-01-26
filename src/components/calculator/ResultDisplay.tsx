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
      <div className="p-8 text-center glass-panel rounded-2xl">
        <h2 className="mb-2 text-xl font-bold text-gray-900 dark:text-white font-display">
          {t("calculator.resultsTitle")}
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          {t("calculator.noResults")}
        </p>
      </div>
    );
  }

  const { positionSize, potentialLoss, potentialProfit } = calculationResult;

  return (
    <div className="p-6 glass-panel rounded-2xl">
      <h2 className="mb-6 text-xl font-bold text-gray-900 cursor-default dark:text-white font-display">
        {t("calculator.resultsTitle")}
      </h2>

      <div className="grid grid-cols-1 gap-4">
        {positionSize > 0 && (
          <div className="p-5 transition-transform border border-indigo-100 shadow-sm rounded-xl bg-indigo-50/50 dark:bg-indigo-900/20 dark:border-indigo-800 hover:scale-[1.02]">
            <p className="text-xs font-semibold tracking-wider text-indigo-600 uppercase dark:text-indigo-300">
              {t("calculator.positionSize")}
            </p>
            <p className="mt-1 text-4xl font-bold text-indigo-700 font-mono dark:text-indigo-400">
              ${formatToTwoDecimals(positionSize)}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {potentialLoss > 0 && (
            <div className="p-5 border border-red-100 shadow-sm rounded-xl bg-red-50/50 dark:bg-red-900/20 dark:border-red-900/50">
              <p className="text-xs font-semibold tracking-wider text-red-600 uppercase dark:text-red-300">
                {t("calculator.potentialLoss")}
              </p>
              <p className="mt-1 text-2xl font-bold text-red-600 font-mono dark:text-red-400">
                ${formatToTwoDecimals(potentialLoss)}
              </p>
            </div>
          )}

          <div
            className={`p-5 border shadow-sm rounded-xl transition-all ${
              potentialProfit > 0
                ? "border-emerald-100 bg-emerald-50/50 dark:bg-emerald-900/20 dark:border-emerald-900/50"
                : "border-gray-100 bg-gray-50/50 dark:bg-slate-800/50 dark:border-gray-700/50"
            }`}
          >
            <p
              className={`text-xs font-semibold tracking-wider uppercase ${
                potentialProfit > 0
                  ? "text-emerald-600 dark:text-emerald-300"
                  : "text-gray-400 dark:text-gray-500"
              }`}
            >
              {t("calculator.potentialProfit")}
            </p>
            {potentialProfit > 0 ? (
              <p className="mt-1 text-3xl font-bold text-transparent font-mono bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-400 dark:from-emerald-400 dark:to-emerald-300">
                ${formatToTwoDecimals(potentialProfit)}
              </p>
            ) : (
              <p className="mt-1 text-2xl font-bold text-gray-400 font-mono dark:text-gray-500 italic">
                {t("common.optional").toLowerCase()}...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
