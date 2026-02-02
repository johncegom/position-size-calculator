import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import LanguageSwitch from "../common/LanguageSwitch";

const Header = () => {
  const { tradeParameters } = useSelector(
    (state: RootState) => state.calculator,
  );
  const [isDark, setIsDark] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      setIsDark(true);
    } else {
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", newIsDark ? "dark" : "light");
  };

  return (
    <header className="fixed top-0 left-0 right-0 md:left-64 z-30 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md transition-all duration-300">
      {/* Creative Gradient Border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 dark:via-indigo-400/20 to-transparent" />

      <div className="px-4 mx-auto max-w-[1600px] sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* App Branding - Left Side */}
          <div className="flex items-center gap-3 md:hidden">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/30">
              P
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl font-display tracking-tight">
              {t("header.titleShort")}
            </h1>
          </div>

          {/* Action Buttons - Right Side */}
          <div className="flex items-center gap-2 sm:gap-4 ml-auto md:ml-0">
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
              aria-label={t("header.ariaToggleTheme")}
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
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
