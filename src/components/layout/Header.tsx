import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import LanguageSwitch from "../common/LanguageSwitch";
import { processFormValues, saveToLocalStorage } from "../../utils";
import { updateTradeParameter } from "../../store/slices/calculatorSlice";
import type { TradeParameters } from "../../types";

const Header = () => {
  const { tradeParameters } = useSelector(
    (state: RootState) => state.calculator
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [formValues, setFormValues] = useState({
    totalCapital: tradeParameters.totalCapital?.toString() || "",
    riskPercentage: tradeParameters.riskPercentage?.toString() || "",
  });

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
    // TODO: Implement theme toggle functionality in Task 4
    console.log("Theme toggle clicked");
  };

  const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    processFormValues(formValues, (paramName, value) => {
      saveToLocalStorage(paramName, value === null ? "0" : value.toString());
      dispatch(
        updateTradeParameter({
          name: paramName as keyof TradeParameters,
          value: value,
        })
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
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* App Branding - Left Side */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                <span className="block sm:hidden">PSC</span>
                <span className="hidden sm:block">{t("header.title")}</span>
              </h1>
            </div>
          </div>

          {/* Action Buttons - Right Side */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Status Indicators - Center (Hidden on mobile) */}
            <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {t("header.risk")}
                </span>
                <span className="font-medium">
                  {`${tradeParameters.riskPercentage}%`}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
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
              className="hidden p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {/* Sun icon for light mode, Moon icon for dark mode */}
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
            </button>

            {/* Settings Button */}
            <button
              onClick={toggleSettings}
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
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
          className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={toggleSettings}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-xl w-full p-6 mt-24"
            onClick={handleModalClick}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
              <button
                onClick={toggleSettings}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:cursor-pointer"
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
            <form className="w-full space-y-4">
              <div className="form-group">
                <label
                  htmlFor="totalCapital"
                  id="totalCapitalLabel"
                  className="block text-sm font-medium text-gray-700 mb-3"
                >
                  {t("calculator.totalCapital")}
                </label>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="form-group">
                <label
                  htmlFor="riskPercentage"
                  id="riskPercentageLabel"
                  className="block text-sm font-medium text-gray-700 mb-3"
                >
                  {t("calculator.riskPercentage")}
                </label>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="mt-6 flex gap-14">
                <button
                  type="button"
                  aria-label="Calculate Position Size"
                  className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 active:scale-95 text-white font-medium py-3 px-4 rounded-md transition-all duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 touch-manipulation hover:cursor-pointer"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  type="button"
                  aria-label="Calculate Position Size"
                  className="w-full bg-gray-500 hover:bg-gray-700 active:bg-gray-800 active:scale-95 text-white font-medium py-3 px-4 rounded-md transition-all duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 touch-manipulation hover:cursor-pointer"
                  onClick={handleCancel}
                >
                  Cancel
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
