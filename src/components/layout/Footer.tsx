import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="relative mt-20 pb-10 pt-0">
      {/* Creative Gradient Separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 dark:via-indigo-400/20 to-transparent" />

      {/* Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-indigo-500/3 dark:bg-indigo-400/5 blur-[80px] -z-10 pointer-events-none" />

      <div className="container mx-auto px-6 pt-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Left: Brand Identity */}
          <div className="text-center md:text-left">
            <h3 className="font-display font-bold text-lg text-gray-900/90 dark:text-white/90 tracking-tight">
              {t("header.titleShort")}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 font-medium tracking-widest uppercase">
              &copy; {new Date().getFullYear()} All rights reserved.
            </p>
          </div>

          {/* Right: Credits & Interactive Link */}
          <div className="flex flex-col items-center md:items-end gap-1">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-light">{t("footer.description")}</span>
              <a
                href="https://github.com/johncegom"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-1 font-bold text-gray-900 dark:text-white transition-colors"
              >
                <span className="bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-indigo-400 dark:to-indigo-300 bg-[length:0%_2px] bg-no-repeat bg-bottom transition-all duration-300 group-hover:bg-[length:100%_2px] pb-0.5">
                  {t("footer.author")}
                </span>
                {/* External Arrow Icon */}
                <svg
                  className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-indigo-500 dark:text-indigo-400"
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
              className="text-[10px] text-gray-400 hover:text-indigo-500 transition-colors"
            >
              v1.0.0 &bull; Open Source
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
