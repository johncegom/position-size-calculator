import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import LanguageSwitch from "../common/LanguageSwitch";
import { processFormValues, saveToLocalStorage } from "../../utils/utils";
import { updateTradeParameter } from "../../store/slices/calculatorSlice";
import type { TradeParameters } from "../../types";

const Header = () => {
  const { tradeParameters } = useSelector(
    (state: RootState) => state.calculator,
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [formValues, setFormValues] = useState({
    totalCapital: tradeParameters.totalCapital?.toString() || "",
    riskPercentage: tradeParameters.riskPercentage?.toString() || "",
  });

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      setIsDark(true);
    } else {
      setIsDark(false);
    }
  }, []);

  useEffect(() => {
    setFormValues({
      totalCapital: tradeParameters.totalCapital?.toString() || "",
      riskPercentage: tradeParameters.riskPercentage?.toString() || "",
    });
  }, [tradeParameters.totalCapital, tradeParameters.riskPercentage]);

  useEffect(() => {
    if (!isSettingsOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSettingsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // cleanup function
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSettingsOpen]);

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const resetFormValues = () => {
    setFormValues({
      totalCapital: tradeParameters.totalCapital?.toString() || "",
      riskPercentage: tradeParameters.riskPercentage?.toString() || "",
    });
  };

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", newIsDark ? "dark" : "light");
  };

  const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
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
    toggleSettings();
  };
  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    resetFormValues();
    toggleSettings();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const normalizedValue = value.replace(",", ".");

    if (normalizedValue === "" || /^(0|[1-9]\d*)([.,]\d*)?$/.test(value)) {
      setFormValues((prev) => {
        return {
          ...prev,
          [name]: normalizedValue,
        };
      });
    }
  };

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md transition-colors">
      {/* Creative Gradient Border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 dark:via-indigo-400/20 to-transparent" />

      <div className="px-4 mx-auto max-w-[1600px] sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* App Branding - Left Side */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/30">
              P
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl font-display tracking-tight">
              {t("header.titleShort")}
            </h1>
          </div>

          {/* Action Buttons - Right Side */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Status Indicators - Center (Hidden on mobile) */}
            <div className="items-center hidden gap-6 mr-4 text-sm md:flex">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {t("header.risk")}
                </span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {`${tradeParameters.riskPercentage}%`}
                </span>
              </div>
              <div className="h-8 w-px bg-gray-200 dark:bg-white/10"></div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {t("header.capital")}
                </span>
                <span className="font-mono font-bold text-gray-900 dark:text-white">{`$${tradeParameters.totalCapital}`}</span>
              </div>
            </div>

            {/* Language Switch */}
            <LanguageSwitch />

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 text-gray-500 transition-all duration-200 rounded-xl hover:bg-gray-100 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10 active:scale-95"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="12" cy="12" r="5" strokeWidth={2} />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                  />
                </svg>
              )}
            </button>

            {/* Settings Button */}
            <button
              onClick={toggleSettings}
              className="p-2.5 text-gray-500 transition-all duration-200 rounded-xl hover:bg-gray-100 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10 active:scale-95"
              aria-label="Open settings"
            >
              {/* Settings gear icon */}
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Settings Modal - Portalled to body to avoid z-index issues */}
      {isSettingsOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300"
            onClick={toggleSettings}
          >
            <div
              className="w-full max-w-md p-8 overflow-hidden text-left align-middle transition-all transform shadow-2xl rounded-3xl bg-white dark:bg-[#0f172a] border border-gray-100 dark:border-white/10 relative"
              onClick={handleModalClick}
            >
              {/* Modal Glow Effect */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-display">
                  {t("settingsModal.title")}
                </h2>
                <button
                  onClick={toggleSettings}
                  className="p-2 text-gray-400 transition-colors rounded-full hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-slate-800 dark:hover:text-gray-300"
                  aria-label="Close settings"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <form className="space-y-6">
                <div className="form-group">
                  <label
                    htmlFor="totalCapital"
                    id="totalCapitalLabel"
                    className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {t("settingsModal.totalCapital")}
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
                      className="w-full py-3 pl-8 pr-4 text-lg transition-all bg-gray-50 border border-gray-200 shadow-sm rounded-xl dark:bg-slate-800/50 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 placeholder-gray-400 dark:placeholder-gray-600 font-mono input-premium text-gray-900"
                      placeholder="0.00"
                    />
                    <span className="absolute text-gray-400 transform -translate-y-1/2 left-4 top-1/2 dark:text-gray-500 group-focus-within:text-indigo-500 transition-colors pointer-events-none font-bold">
                      $
                    </span>
                  </div>
                </div>
                <div className="form-group">
                  <label
                    htmlFor="riskPercentage"
                    id="riskPercentageLabel"
                    className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {t("settingsModal.riskPercentage")}
                  </label>
                  <div className="relative group">
                    <input
                      type="tel"
                      inputMode="decimal"
                      pattern="(0|[1-9]\d*)([.,]\d*)?"
                      id="riskPercentage"
                      name="riskPercentage"
                      min="0"
                      required
                      aria-labelledby="riskPercentageLabel"
                      aria-required="true"
                      value={formValues.riskPercentage || ""}
                      onChange={handleInputChange}
                      className="w-full pl-4 pr-8 py-3 text-lg transition-all bg-gray-50 border border-gray-200 shadow-sm rounded-xl dark:bg-slate-800/50 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 placeholder-gray-400 dark:placeholder-gray-600 font-mono input-premium"
                      placeholder="1.0"
                    />
                    <span className="absolute text-gray-400 transform -translate-y-1/2 right-4 top-1/2 dark:text-gray-500 group-focus-within:text-indigo-500 transition-colors font-bold">
                      %
                    </span>
                  </div>
                </div>
                <div className="flex gap-4 pt-4 mt-8 border-t border-gray-100 dark:border-gray-800/50">
                  <button
                    type="button"
                    aria-label="Cancel"
                    className="flex-1 px-4 py-3 font-medium text-gray-700 transition-all bg-white border border-gray-200 shadow-sm rounded-xl hover:bg-gray-50 hover:border-gray-300 dark:bg-slate-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-slate-700 active:scale-[0.98]"
                    onClick={handleCancel}
                  >
                    {t("settingsModal.cancel")}
                  </button>
                  <button
                    type="button"
                    aria-label="Save Settings"
                    className="flex-1 px-4 py-3 font-bold text-white transition-all shadow-lg bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-xl hover:to-indigo-600 hover:shadow-indigo-500/25 active:scale-[0.98] focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                    onClick={handleSave}
                  >
                    {t("settingsModal.save")}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </header>
  );
};

export default Header;
