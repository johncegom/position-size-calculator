import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import type { RootState } from "../store/store";
import { processFormValues, saveToLocalStorage } from "../utils/utils";
import { updateTradeParameter } from "../store/slices/calculatorSlice";
import type { TradeParameters } from "../types";
import {
  Wallet,
  ShieldAlert,
  Save,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowLeftRight,
} from "lucide-react";
import { cn } from "../lib/utils";

const Settings = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { tradeParameters } = useSelector(
    (state: RootState) => state.calculator,
  );

  const [formValues, setFormValues] = useState({
    totalCapital: tradeParameters.totalCapital?.toString() || "",
    riskPercentage: tradeParameters.riskPercentage?.toString() || "",
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [useRiskValue, setUseRiskValue] = useState(false); // Toggle state

  // Sync local state with Redux
  useEffect(() => {
    setFormValues({
      totalCapital: tradeParameters.totalCapital?.toString() || "",
      riskPercentage: tradeParameters.riskPercentage?.toString() || "",
    });
  }, [tradeParameters.totalCapital, tradeParameters.riskPercentage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Allow empty string or valid number/decimal pattern
    const normalizedValue = value.replace(",", ".");

    if (normalizedValue === "" || /^(0|[1-9]\d*)([.,]\d*)?$/.test(value)) {
      setFormValues((prev) => ({
        ...prev,
        [name]: normalizedValue,
      }));
    }
  };

  const setRiskPreset = (amount: string) => {
    setFormValues((prev) => ({ ...prev, riskPercentage: amount }));
    // If user clicks a preset, force switch back to % mode so they see what they clicked
    setUseRiskValue(false);
  };

  const handleRiskValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(",", ".");
    if (value === "" || /^(0|[1-9]\d*)([.,]\d*)?$/.test(value)) {
      // Convert Value -> Percentage for storage
      const capital = parseFloat(formValues.totalCapital) || 0;
      const riskVal = parseFloat(value) || 0;

      let newPercentage = "";
      if (capital > 0) {
        const p = (riskVal / capital) * 100;
        newPercentage = parseFloat(p.toFixed(2)).toString(); // limiting decimal places for stability
      }

      setFormValues((prev) => ({
        ...prev,
        riskPercentage: newPercentage,
      }));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    processFormValues(formValues, (paramName, value) => {
      saveToLocalStorage(paramName, value === null ? "0" : value.toString());
      dispatch(
        updateTradeParameter({
          name: paramName as keyof TradeParameters,
          value: value,
        }),
      );
    });

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const getRiskLevelColor = (risk: number) => {
    if (risk <= 1)
      return "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20";
    if (risk <= 2)
      return "text-blue-500 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20";
    if (risk <= 5)
      return "text-orange-500 bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20";
    return "text-red-500 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20";
  };

  const getRiskLabel = (risk: number) => {
    if (risk <= 1) return t("settingsPage.riskLevel.low");
    if (risk <= 3) return t("settingsPage.riskLevel.medium");
    return t("settingsPage.riskLevel.high");
  };

  const currentRiskPercentage = parseFloat(formValues.riskPercentage) || 0;
  const currentCapital = parseFloat(formValues.totalCapital) || 0;
  const currentRiskValue = (currentCapital * currentRiskPercentage) / 100;

  return (
    <div className="max-w-3xl mx-auto pb-12 animate-fade-in-up">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-indigo-800 to-gray-900 dark:from-white dark:via-indigo-200 dark:to-white font-display">
          {t("settingsPage.title")}
        </h1>
        <p className="mt-3 text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          {t("settingsPage.subtitle")}
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 sm:space-y-8">
        {/* Account Capital Card */}
        <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/5 rounded-3xl p-6 sm:p-8 shadow-xl shadow-indigo-500/5 hover:shadow-indigo-500/10 transition-shadow">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 text-center sm:text-left">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl text-indigo-600 dark:text-indigo-400 shrink-0">
              <Wallet className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <div className="flex-1 w-full">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t("settingsPage.accountParams")}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                {t("settingsPage.capitalDesc")}
              </p>

              <div className="relative group max-w-md mx-auto sm:mx-0">
                <span className="absolute text-gray-400 transform -translate-y-1/2 left-4 top-1/2 dark:text-gray-500 group-focus-within:text-indigo-500 transition-colors pointer-events-none font-bold text-xl">
                  $
                </span>
                <input
                  type="tel"
                  inputMode="decimal"
                  name="totalCapital"
                  value={formValues.totalCapital}
                  onChange={handleInputChange}
                  className="w-full py-4 pl-10 pr-4 text-2xl sm:text-3xl font-bold tracking-tight transition-all bg-gray-50 border-2 border-transparent hover:bg-gray-100 hover:border-gray-200 rounded-2xl dark:bg-slate-900/50 dark:hover:bg-slate-900 dark:text-white focus:ring-0 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 placeholder-gray-300 dark:placeholder-gray-700 font-mono"
                  placeholder="0.00"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 uppercase tracking-widest pointer-events-none">
                  {t("settingsPage.currency")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Management Card */}
        <div className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-white/5 rounded-3xl p-6 sm:p-8 shadow-xl shadow-indigo-500/5 hover:shadow-indigo-500/10 transition-shadow">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 text-center sm:text-left">
            <div
              className={cn(
                "p-3 rounded-2xl transition-colors duration-300 shrink-0",
                getRiskLevelColor(currentRiskPercentage).split(" ")[0],
                getRiskLevelColor(currentRiskPercentage).split(" ")[1],
              )}
            >
              <ShieldAlert className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center mb-2 gap-2 sm:gap-0">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t("settingsPage.riskManagement")}
                </h3>
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-widest",
                    getRiskLevelColor(currentRiskPercentage),
                  )}
                >
                  {getRiskLabel(currentRiskPercentage)}
                </span>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                {t("settingsPage.riskDesc")}
              </p>

              {/* Input & Toggle Area */}
              <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-center lg:items-start mb-8 w-full">
                <div className="w-full lg:w-64 space-y-2 mx-auto lg:mx-0">
                  <div className="relative group w-full">
                    {useRiskValue ? (
                      // Risk Value Input Mode
                      <>
                        <input
                          type="tel"
                          inputMode="decimal"
                          value={
                            currentRiskValue > 0
                              ? parseFloat(currentRiskValue.toFixed(2))
                              : ""
                          }
                          onChange={handleRiskValueChange}
                          className="w-full py-4 pl-10 pr-16 text-2xl sm:text-3xl font-bold transition-all bg-gray-50 border-2 border-transparent hover:bg-gray-100 hover:border-gray-200 rounded-2xl dark:bg-slate-900/50 dark:hover:bg-slate-900 dark:text-white focus:ring-0 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 placeholder-gray-300 dark:placeholder-gray-700 font-mono"
                          placeholder="0.00"
                        />
                        <span className="absolute text-gray-400 transform -translate-y-1/2 left-4 top-1/2 dark:text-gray-500 group-focus-within:text-indigo-500 transition-colors font-bold text-lg">
                          $
                        </span>
                        {/* Suffix Actions */}
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setUseRiskValue(false)}
                            className="p-1.5 text-gray-400 hover:text-indigo-600 dark:text-gray-500 dark:hover:text-indigo-400 bg-gray-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-500/20 rounded-lg transition-all"
                            title={t("settingsPage.switchToPercentage")}
                          >
                            <ArrowLeftRight className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Secondary View (Percentage) */}
                        <div className="absolute top-full left-0 mt-2 text-xs text-gray-500 dark:text-gray-400 font-mono pl-1">
                          {t("settingsPage.approxRiskOfCapital", {
                            percentage: currentRiskPercentage,
                          })}
                        </div>
                      </>
                    ) : (
                      // Percentage Input Mode
                      <>
                        <input
                          type="tel"
                          inputMode="decimal"
                          name="riskPercentage"
                          value={formValues.riskPercentage}
                          onChange={handleInputChange}
                          className="w-full py-4 pl-6 pr-20 text-2xl sm:text-3xl font-bold transition-all bg-gray-50 border-2 border-transparent hover:bg-gray-100 hover:border-gray-200 rounded-2xl dark:bg-slate-900/50 dark:hover:bg-slate-900 dark:text-white focus:ring-0 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 placeholder-gray-300 dark:placeholder-gray-700 font-mono"
                          placeholder="1.0"
                        />

                        {/* Suffix Actions */}
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                          <span className="text-gray-400 dark:text-gray-500 group-focus-within:text-indigo-500 transition-colors font-bold text-xl">
                            %
                          </span>
                          <button
                            type="button"
                            onClick={() => setUseRiskValue(true)}
                            className="p-1.5 text-gray-400 hover:text-indigo-600 dark:text-gray-500 dark:hover:text-indigo-400 bg-gray-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-500/20 rounded-lg transition-all"
                            title={t("settingsPage.switchToValue")}
                          >
                            <ArrowLeftRight className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Secondary View (Value) */}
                        <div className="absolute top-full left-0 mt-2 text-xs text-gray-500 dark:text-gray-400 font-mono pl-1">
                          {t("settingsPage.approxRiskValue", {
                            value: currentRiskValue.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            }),
                          })}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Visual Warning/Insight */}
                <div className="flex-1 w-full text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-slate-900/50 p-4 rounded-xl border border-gray-100 dark:border-white/5 flex items-center gap-3 min-h-[82px] mt-2 lg:mt-0">
                  {currentRiskPercentage > 5 ? (
                    <>
                      <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <span>
                        {t("settingsPage.riskWarnings.highPart1")}{" "}
                        <strong>
                          {(
                            100 *
                            (1 - Math.pow(1 - currentRiskPercentage / 100, 5))
                          ).toFixed(1)}
                          %
                        </strong>{" "}
                        {t("settingsPage.riskWarnings.highPart2")}
                      </span>
                    </>
                  ) : currentRiskPercentage > 2 ? (
                    <>
                      <TrendingUp className="w-5 h-5 text-orange-500 flex-shrink-0" />
                      <span>{t("settingsPage.riskWarnings.aggressive")}</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      <span>{t("settingsPage.riskWarnings.sustainable")}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Quick Presets */}
              <div className="space-y-3 pt-6">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block text-center sm:text-left">
                  {t("settingsPage.presets")}
                </label>
                <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                  <button
                    type="button"
                    onClick={() => setRiskPreset("0.5")}
                    className={cn(
                      "flex-1 min-w-[140px] py-3 px-4 rounded-xl border transition-all flex flex-col items-center gap-1 group/btn",
                      formValues.riskPercentage === "0.5"
                        ? "bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 shadow-sm"
                        : "bg-white border-gray-200 text-gray-600 hover:border-indigo-300 hover:bg-indigo-50/30 dark:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:border-indigo-500/50 dark:hover:bg-slate-800/80",
                    )}
                  >
                    <CheckCircle2
                      className={cn(
                        "w-5 h-5 mb-1",
                        formValues.riskPercentage === "0.5"
                          ? "text-indigo-600 dark:text-indigo-400"
                          : "text-gray-400 group-hover/btn:text-indigo-500 dark:text-gray-600 dark:group-hover/btn:text-indigo-400",
                      )}
                    />
                    <span className="text-lg font-bold">0.5%</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRiskPreset("1")}
                    className={cn(
                      "flex-1 min-w-[140px] py-3 px-4 rounded-xl border transition-all flex flex-col items-center gap-1 group/btn",
                      formValues.riskPercentage === "1"
                        ? "bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 shadow-sm"
                        : "bg-white border-gray-200 text-gray-600 hover:border-indigo-300 hover:bg-indigo-50/30 dark:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:border-indigo-500/50 dark:hover:bg-slate-800/80",
                    )}
                  >
                    <CheckCircle2
                      className={cn(
                        "w-5 h-5 mb-1",
                        formValues.riskPercentage === "1"
                          ? "text-indigo-600 dark:text-indigo-400"
                          : "text-gray-400 group-hover/btn:text-indigo-500 dark:text-gray-600 dark:group-hover/btn:text-indigo-400",
                      )}
                    />
                    <span className="text-lg font-bold">1.0%</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                      {t("settingsPage.conservative")}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRiskPreset("2")}
                    className={cn(
                      "flex-1 min-w-[140px] py-3 px-4 rounded-xl border transition-all flex flex-col items-center gap-1 group/btn",
                      formValues.riskPercentage === "2"
                        ? "bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 shadow-sm"
                        : "bg-white border-gray-200 text-gray-600 hover:border-indigo-300 hover:bg-indigo-50/30 dark:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:border-indigo-500/50 dark:hover:bg-slate-800/80",
                    )}
                  >
                    <TrendingUp
                      className={cn(
                        "w-5 h-5 mb-1",
                        formValues.riskPercentage === "2"
                          ? "text-indigo-600 dark:text-indigo-400"
                          : "text-gray-400 group-hover/btn:text-indigo-500 dark:text-gray-600 dark:group-hover/btn:text-indigo-400",
                      )}
                    />
                    <span className="text-lg font-bold">2.0%</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                      {t("settingsPage.moderate")}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRiskPreset("5")}
                    className={cn(
                      "flex-1 min-w-[140px] py-3 px-4 rounded-xl border transition-all flex flex-col items-center gap-1 group/btn",
                      formValues.riskPercentage === "5"
                        ? "bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 shadow-sm"
                        : "bg-white border-gray-200 text-gray-600 hover:border-indigo-300 hover:bg-indigo-50/30 dark:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:border-indigo-500/50 dark:hover:bg-slate-800/80",
                    )}
                  >
                    <AlertTriangle
                      className={cn(
                        "w-5 h-5 mb-1",
                        formValues.riskPercentage === "5"
                          ? "text-indigo-600 dark:text-indigo-400"
                          : "text-gray-400 group-hover/btn:text-red-500 dark:text-gray-600 dark:group-hover/btn:text-red-400",
                      )}
                    />
                    <span className="text-lg font-bold">5.0%</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                      {t("settingsPage.aggressive")}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-center sm:justify-end gap-4 pt-4">
          {showSuccess && (
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-2 rounded-xl animate-fade-in w-full sm:w-auto justify-center">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-bold">
                {t("settingsPage.saved")}
              </span>
            </div>
          )}
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-8 py-4 w-full sm:w-auto text-white transition-all shadow-xl shadow-indigo-500/20 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-2xl hover:to-indigo-600 hover:shadow-indigo-500/40 active:scale-[0.98] focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 font-bold text-lg"
          >
            <Save className="w-5 h-5" />
            {t("settingsModal.save")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
