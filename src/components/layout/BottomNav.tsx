import { NavLink } from "react-router-dom";
import { Calculator, Settings, Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../../lib/utils";

const BottomNav = () => {
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
    <nav className="md:hidden fixed bottom-6 left-4 right-4 z-50">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-gray-200/50 dark:border-white/10 rounded-2xl shadow-xl shadow-indigo-500/5 flex items-center justify-around p-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 relative w-full",
                isActive
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300",
              )
            }
          >
            {({ isActive }) => (
              <>
                {/* Active Indicator Backdrop */}
                {isActive && (
                  <div className="absolute inset-0 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl -z-10 animate-fade-in" />
                )}

                <item.icon
                  className={cn(
                    "w-6 h-6 mb-1 transition-transform duration-300",
                    isActive ? "scale-110" : "scale-100",
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className="text-[10px] font-medium tracking-wide">
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
