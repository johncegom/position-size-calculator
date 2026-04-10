import { useTranslation } from "react-i18next";
import { useCalculator } from "../../hooks/useCalculator";

const CalculatorForm = () => {
  const { t } = useTranslation();
  const {
    formValues,
    riskInputMode,
    riskInputValue,
    toggleRiskMode,
    handleInputChange,
    handleRiskInputChange,
    handleResetToDefaults,
    handleSubmit,
    error,
    tradeDirection,
  } = useCalculator();

  const isLong = tradeDirection === "long";

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full space-y-6">
        {/* Trade Direction Badge Indicator */}
        {tradeDirection && (
          <div className="flex justify-center mb-2 animate-in zoom-in-95 fade-in duration-300">
            <div
              className={`px-4 py-1.5 rounded-full border flex items-center gap-2 shadow-sm ${
                isLong
                  ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                  : "bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full animate-pulse ${
                  isLong ? "bg-emerald-500" : "bg-rose-500"
                }`}
              />
              <span className="text-xs font-bold uppercase tracking-widest font-display">
                {isLong ? t("common.long") : t("common.short")}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className={`w-4 h-4 transition-transform duration-500 ${isLong ? "rotate-180" : ""}`}
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        )}
        {error && (
          <div className="p-4 mb-4 text-sm font-medium border rounded-xl bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20 text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
              {error}
            </div>
          </div>
        )}
        <div className="form-group">
          <label
            htmlFor="totalCapital"
            id="totalCapitalLabel"
            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {t("calculator.totalCapital")}
          </label>
          <div className="relative group">
            <input
              type="tel"
              inputMode="decimal"
              pattern="(0|[1-9]\d*)([.,]\d*)?"
              id="totalCapital"
              name="totalCapital"
              min="0"
              required
              aria-labelledby="totalCapitalLabel"
              aria-required="true"
              value={formValues.totalCapital || ""}
              onChange={handleInputChange}
              className="w-full py-3 pl-8 pr-4 text-lg transition-all bg-white border-0 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700/50 rounded-xl dark:bg-slate-900/50 dark:text-white focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 dark:placeholder-gray-600 font-mono input-premium"
              placeholder="0.00"
            />
            <span className="absolute text-gray-400 transform -translate-y-1/2 left-4 top-1/2 dark:text-gray-500 group-focus-within:opacity-20 transition-all duration-300 group-focus-within:-translate-x-1 pointer-events-none">
              $
            </span>
          </div>
        </div>

        <div className="form-group">
          <div className="flex flex-wrap items-baseline justify-between mb-2">
            <label
              htmlFor="riskInput"
              id="riskInputLabel"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {riskInputMode === "percentage"
                ? t("calculator.riskPercentage")
                : t("calculator.riskAmount")}
            </label>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500 dark:text-gray-400">
                {riskInputMode === "percentage"
                  ? `${t("common.riskValue")}: `
                  : `${t("common.riskPercentageShort")}: `}
                <span className="font-bold font-mono text-indigo-600 dark:text-indigo-400">
                  {riskInputMode === "percentage"
                    ? `$${(
                        (parseFloat(formValues.totalCapital || "0") *
                          parseFloat(formValues.riskPercentage || "0")) /
                        100
                      ).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    : `${parseFloat(
                        formValues.riskPercentage || "0",
                      ).toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}%`}
                </span>
              </span>

              <button
                type="button"
                onClick={toggleRiskMode}
                className="p-1 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-indigo-500"
                title="Swap Risk Input Mode"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="relative group">
            <input
              type="tel"
              inputMode="decimal"
              pattern="(0|[1-9]\d*)([.,]\d*)?"
              id="riskInput"
              name={
                riskInputMode === "percentage" ? "riskPercentage" : "riskValue"
              }
              min="0"
              required
              aria-labelledby="riskInputLabel"
              aria-required="true"
              value={riskInputValue}
              onChange={handleRiskInputChange}
              className="w-full px-4 py-3 text-lg transition-all bg-white border-0 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700/50 rounded-xl dark:bg-slate-900/50 dark:text-white focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 dark:placeholder-gray-600 font-mono input-premium"
              placeholder={riskInputMode === "percentage" ? "1.0" : "0.00"}
            />
            <span className="absolute text-gray-400 transform -translate-y-1/2 right-4 top-1/2 dark:text-gray-500 group-focus-within:opacity-20 transition-all duration-300 group-focus-within:translate-x-1">
              {riskInputMode === "percentage" ? "%" : "$"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="form-group">
            <label
              htmlFor="entryPrice"
              id="entryPriceLabel"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t("calculator.entryPrice")}
            </label>
            <div className="relative group">
              <input
                type="tel"
                inputMode="decimal"
                pattern="(0|[1-9]\d*)([.,]\d*)?"
                id="entryPrice"
                name="entryPrice"
                min="0"
                required
                aria-labelledby="entryPriceLabel"
                aria-required="true"
                value={formValues.entryPrice || ""}
                onChange={handleInputChange}
                className="w-full py-3 pl-8 pr-4 text-lg transition-all bg-white border-0 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700/50 rounded-xl dark:bg-slate-900/50 dark:text-white focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 dark:placeholder-gray-600 font-mono input-premium"
                placeholder="0.00"
              />
              <span className="absolute text-gray-400 transform -translate-y-1/2 left-4 top-1/2 dark:text-gray-500 group-focus-within:opacity-20 transition-all duration-300 group-focus-within:-translate-x-1 pointer-events-none">
                $
              </span>
            </div>
          </div>

          <div className="form-group">
            <label
              htmlFor="stopLossPrice"
              id="stopLossPriceLabel"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t("calculator.stopLossPrice")}
            </label>
            <div className="relative group">
              <input
                type="tel"
                inputMode="decimal"
                pattern="(0|[1-9]\d*)([.,]\d*)?"
                id="stopLossPrice"
                name="stopLossPrice"
                min="0"
                required
                aria-labelledby="stopLossPriceLabel"
                aria-required="true"
                value={formValues.stopLossPrice || ""}
                onChange={handleInputChange}
                className="w-full py-3 pl-8 pr-4 text-lg transition-all bg-white border-0 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700/50 rounded-xl dark:bg-slate-900/50 dark:text-white focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 dark:placeholder-gray-600 font-mono input-premium"
                placeholder="0.00"
              />
              <span className="absolute text-gray-400 transform -translate-y-1/2 left-4 top-1/2 dark:text-gray-500 group-focus-within:opacity-20 transition-all duration-300 group-focus-within:-translate-x-1 pointer-events-none">
                $
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="form-group">
            <label
              htmlFor="expectedRR"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t("calculator.expectedRR")}
            </label>
            <div className="relative group">
              <input
                type="tel"
                inputMode="decimal"
                pattern="(0|[1-9]\d*)([.,]\d*)?"
                id="expectedRR"
                name="expectedRR"
                min="0"
                value={formValues.expectedRR || ""}
                onChange={handleInputChange}
                className="w-full py-3 pr-12 pl-4 text-lg transition-all bg-white border-0 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700/50 rounded-xl dark:bg-slate-900/50 dark:text-white focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 dark:placeholder-gray-600 font-mono input-premium"
                placeholder="2.0"
              />
              <span className="absolute text-gray-400 transform -translate-y-1/2 right-4 top-1/2 dark:text-gray-500 group-focus-within:opacity-20 transition-all duration-300 group-focus-within:translate-x-1 pointer-events-none text-xs font-bold font-mono">
                R:R
              </span>
            </div>
          </div>

          <div className="form-group">
            <label
              htmlFor="takeProfitPrice"
              id="takeProfitPriceLabel"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t("calculator.takeProfitPrice")}{" "}
              <span className="text-gray-400 text-xs font-normal ml-1">
                ({t("common.optional")})
              </span>
            </label>
            <div className="relative group">
              <input
                type="tel"
                inputMode="decimal"
                pattern="(0|[1-9]\d*)([.,]\d*)?"
                id="takeProfitPrice"
                name="takeProfitPrice"
                min="0"
                aria-labelledby="takeProfitPriceLabel"
                value={formValues.takeProfitPrice || ""}
                onChange={handleInputChange}
                className="w-full py-3 pl-8 pr-4 text-lg transition-all bg-white border-0 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700/50 rounded-xl dark:bg-slate-900/50 dark:text-white focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 dark:placeholder-gray-600 font-mono input-premium"
                placeholder="0.00"
              />
              <span className="absolute text-gray-400 transform -translate-y-1/2 left-4 top-1/2 dark:text-gray-500 group-focus-within:opacity-20 transition-all duration-300 group-focus-within:-translate-x-1 pointer-events-none">
                $
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-8">
          <button
            type="submit"
            aria-label="Calculate Position Size"
            className="flex-1 px-6 py-4 text-lg font-bold tracking-wide text-white transition-all transform shadow-lg bg-linear-to-r from-indigo-600 to-indigo-500 rounded-xl shadow-indigo-500/30 hover:to-indigo-600 hover:shadow-indigo-500/40 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {t("calculator.calculateButton")}
          </button>

          <button
            type="button"
            onClick={handleResetToDefaults}
            aria-label="Reset to Default Settings"
            title="Reset to Default Settings"
            className="p-4 text-gray-500 transition-all bg-white border border-gray-200 shadow-sm dark:bg-dark-card dark:border-gray-700 dark:text-gray-400 rounded-xl hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-800 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </button>
        </div>
      </form>
    </>
  );
};

export default CalculatorForm;
