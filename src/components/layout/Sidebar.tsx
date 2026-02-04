import { NavLink } from "react-router-dom";
import { Settings, Info, Calculator } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../../lib/utils";

const Sidebar = () => {
  const { t } = useTranslation();

  const navItems = [
    {
      to: "/",
      icon: Calculator,
      label: t("nav.calculator"),
    },
    {
      to: "/settings",
      icon: Settings,
      label: t("nav.settings"),
    },
    {
      to: "/about",
      icon: Info,
      label: t("nav.about"),
    },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-white dark:bg-[#0f172a] border-r border-gray-200 dark:border-gray-800 z-40 transition-colors duration-300">
      {/* Logo Area */}
      <div className="h-20 flex items-center px-8 border-b border-gray-100 dark:border-gray-800/50">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/30 mr-3">
          P
        </div>
        <span className="font-display font-bold text-xl text-gray-900 dark:text-white tracking-tight">
          Position<span className="text-indigo-500">Calc</span>
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                isActive
                  ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 font-medium"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-slate-800 dark:hover:text-white",
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-indigo-500 rounded-r-full" />
                )}
                <item.icon
                  className={cn(
                    "w-5 h-5 transition-colors",
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300",
                  )}
                />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Status Footer */}
      <div className="p-6 border-t border-gray-100 dark:border-gray-800/50">
        <div className="flex items-center gap-2 px-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-semibold">
            {t("common.systemActive")}
          </span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
