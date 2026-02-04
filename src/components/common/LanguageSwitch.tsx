import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

interface Language {
  code: string;
  name: string;
}

const SUPPORTED_LANGUAGES: Language[] = [
  { code: "en", name: "English" },
  { code: "vi", name: "Tiếng Việt" },
];

const LanguageSwitch = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  const currentLanguage =
    SUPPORTED_LANGUAGES.find((lang) => lang.code === i18n.language) ||
    SUPPORTED_LANGUAGES[0];

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    closeDropdown();
  };

  return (
    <div className="relative">
      <button
        onClick={() => toggleDropdown()}
        className="flex items-center p-2 space-x-1 sm:space-x-2 text-gray-500 transition-colors duration-200 rounded-md hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:cursor-pointer dark:text-gray-200 dark:hover:text-gray-800 dark:hover:bg-gray-200"
        aria-label={t("common.language")}
      >
        {/* Mobile: Globe Icon */}
        <Globe className="w-5 h-5 sm:hidden" />

        {/* Desktop: Text Code */}
        <span className="hidden text-sm font-medium sm:block">
          {currentLanguage.code.toUpperCase()}
        </span>

        {/* Chevron */}
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Overlay to close dropdown when clicking outside */}
          <div className="fixed inset-0 z-10" onClick={() => closeDropdown()} />

          {/* Dropdown menu */}
          <div className="absolute right-0 z-20 w-48 mt-2 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="py-1" role="menu">
              {SUPPORTED_LANGUAGES.map((language) => (
                <button
                  key={language.code}
                  onClick={() => changeLanguage(language.code)}
                  className={`hover:cursor-pointer flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 ${
                    i18n.language === language.code
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700"
                  }`}
                  role="menuitem"
                >
                  <span>{language.name}</span>
                  {i18n.language === language.code && (
                    <svg
                      className="w-4 h-4 ml-auto"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitch;
