import { useEffect, useState } from "react";
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
    <header className="bg-white border-b border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-400">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* App Branding - Left Side */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-50 sm:text-xl">
                <span className="block cursor-pointer sm:hidden">PSC</span>
                <span className="hidden cursor-default sm:block">
                  {t("header.title")}
                </span>
              </h1>
            </div>
          </div>

          {/* Action Buttons - Right Side */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Status Indicators - Center (Hidden on mobile) */}
            <div className="items-center hidden space-x-4 text-sm text-gray-600 dark:text-gray-200 md:flex">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500 cursor-default dark:text-gray-200">
                  {t("header.risk")}
                </span>
                <span className="font-medium">
                  {`${tradeParameters.riskPercentage}%`}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500 cursor-default dark:text-gray-200">
                  {t("header.capital")}
                </span>
                <span className="font-medium">{`$${tradeParameters.totalCapital}`}</span>
              </div>
            </div>

            {/* Language Switch */}
            <LanguageSwitch />

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 transition-colors duration-200 rounded-md cursor-pointer dark:text-gray-200 dark:hover:text-gray-800 dark:hover:bg-gray-200 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="p-2 text-gray-500 transition-colors duration-200 rounded-md cursor-pointer dark:text-gray-200 dark:hover:text-gray-800 dark:hover:bg-gray-200 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity"
          onClick={toggleSettings}
        >
          <div
            className="w-full max-w-md p-8 overflow-hidden text-left align-middle transition-all transform shadow-2xl rounded-2xl bg-white dark:bg-[#0f172a] border border-gray-100 dark:border-white/10"
            onClick={handleModalClick}
          >
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
                    className="w-full py-3 pl-8 pr-4 text-lg transition-all bg-white border border-gray-200 shadow-sm rounded-xl dark:bg-slate-800/50 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 dark:placeholder-gray-600 font-mono input-premium text-gray-900"
                    placeholder="0.00"
                  />
                  <span className="absolute text-gray-400 transform -translate-y-1/2 left-4 top-1/2 dark:text-gray-500 group-focus-within:opacity-20 transition-all duration-300 group-focus-within:-translate-x-1 pointer-events-none">
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
                    className="w-full pl-4 pr-8 py-3 text-lg transition-all bg-white border border-gray-200 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700/50 rounded-xl dark:bg-slate-800/50 dark:text-white focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 dark:placeholder-gray-600 font-mono input-premium"
                    placeholder="1.0"
                  />
                  <span className="absolute text-gray-400 transform -translate-y-1/2 right-4 top-1/2 dark:text-gray-500 group-focus-within:opacity-20 transition-all duration-300 group-focus-within:translate-x-1">
                    %
                  </span>
                </div>
              </div>
              <div className="flex gap-4 pt-2 mt-8">
                <button
                  type="button"
                  aria-label="Cancel"
                  className="flex-1 px-4 py-3 font-medium text-gray-700 transition-all bg-white border border-gray-200 shadow-sm rounded-xl hover:bg-gray-50 dark:bg-transparent dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5 active:scale-[0.98] outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  aria-label="Save Settings"
                  className="flex-1 px-4 py-3 font-bold text-white transition-all shadow-lg bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-xl hover:to-indigo-600 hover:shadow-indigo-500/25 active:scale-[0.98] outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
