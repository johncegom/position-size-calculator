import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="relative mt-20 pb-10 pt-0">
      {/* Creative Gradient Separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 dark:via-indigo-400/20 to-transparent" />

      {/* Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-indigo-500/3 dark:bg-indigo-400/5 blur-[80px] -z-10 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-6">
          {/* Left: Brand Identity */}
          <div className="text-center md:text-left space-y-2">
            <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white tracking-tight">
              {t("header.titleShort")}
            </h3>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium tracking-[0.2em] uppercase">
              &copy; {new Date().getFullYear()}
            </p>
          </div>

          {/* Mobile Divider */}
          <div className="w-12 h-px bg-gray-200 dark:bg-white/10 md:hidden" />

          {/* Right: Credits & Interactive Link */}
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-light">{t("footer.description")}</span>
              <a
                href="https://github.com/johncegom"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-1 font-bold text-gray-900 dark:text-white transition-colors py-1 px-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-500/20"
              >
                <span className="text-indigo-600 dark:text-indigo-300">
                  {t("footer.author")}
                </span>
                {/* External Arrow Icon */}
                <svg
                  className="w-3 h-3 text-indigo-500 dark:text-indigo-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </a>
            </div>
            <a
              href="https://github.com/johncegom/position-size-calculator"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-gray-400 hover:text-indigo-500 transition-colors flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              v1.0.0 &bull; Open Source
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
