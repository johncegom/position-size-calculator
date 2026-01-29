import { Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";
import CalculatorForm from "../components/calculator/CalculatorForm";

const ResultDisplay = lazy(
  () => import("../components/calculator/ResultDisplay"),
);
const RiskRewardVisual = lazy(
  () => import("../components/calculator/RiskRewardVisual"),
);
const RiskRewardSimulator = lazy(
  () => import("../components/calculator/RiskRewardSimulator"),
);
const GrowthSimulator = lazy(
  () => import("../components/calculator/GrowthSimulator"),
);

const Home = () => {
  const { t } = useTranslation();
  return (
    <div className="container min-h-screen px-6 py-8 mx-auto pt-24 lg:pt-32 max-w-[1600px] animate-fade-in">
      <header className="mb-12 text-center lg:text-left lg:mb-16">
        <h1 className="text-4xl font-bold tracking-tight text-transparent cursor-default lg:text-7xl font-display bg-clip-text bg-gradient-to-r from-brand-primary via-brand-secondary to-accent drop-shadow-sm">
          {t("calculator.title")}
        </h1>
        <p className="mt-5 text-xl text-text-secondary-light dark:text-text-secondary-dark font-light tracking-wide max-w-2xl">
          {t("calculator.subtitle")}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14">
        {/* Left Sidebar: Controls - Sticky on Desktop */}
        <aside className="lg:col-span-5 xl:col-span-4">
          <div className="lg:sticky lg:top-24 animate-fade-in animate-delay-100">
            <div className="p-1 rounded-3xl bg-gradient-to-br from-white/40 to-white/10 dark:from-white/5 dark:to-transparent">
              <div className="p-6 rounded-2xl glass-panel shadow-xl dark:shadow-[0_0_40px_-10px_rgba(99,102,241,0.15)] ring-1 ring-black/5 dark:ring-white/10">
                <CalculatorForm />
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-accent/5 border border-accent/10 lg:block hidden animate-fade-in animate-delay-300">
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark font-mono text-center">
                {t("calculator.proTip")}
              </p>
            </div>
          </div>
        </aside>

        {/* Right Content: Dashboard Grid */}
        <section className="lg:col-span-7 xl:col-span-8 flex flex-col gap-8">
          <Suspense
            fallback={
              <div className="h-64 glass-panel rounded-3xl animate-pulse" />
            }
          >
            {/* Hero Card: Results */}
            <div className="animate-fade-in animate-delay-200">
              <ResultDisplay />
            </div>

            {/* Visuals & Simulators Stack */}
            <div className="flex flex-col gap-8">
              <div className="animate-fade-in animate-delay-300">
                <RiskRewardVisual />
              </div>

              <div className="animate-fade-in animate-delay-400">
                <RiskRewardSimulator />
              </div>

              <div className="animate-fade-in animate-delay-500">
                <GrowthSimulator />
              </div>
            </div>
          </Suspense>
        </section>
      </div>
    </div>
  );
};

export default Home;
