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
    <div className="container min-h-screen px-4 py-8 mx-auto">
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-transparent cursor-default md:text-5xl font-display bg-clip-text bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-indigo-400 dark:to-indigo-500">
          {t("calculator.title")}
        </h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
          {t("calculator.subtitle")}
        </p>
      </header>

      <section className="flex flex-col gap-8 lg:flex-row">
        {/* Left side */}
        <aside className="w-full lg:w-2/5">
          <div className="p-6 rounded-2xl glass-panel shadow-xl dark:shadow-[0_0_40px_-10px_rgba(99,102,241,0.1)]">
            <CalculatorForm />
          </div>
        </aside>

        {/* Right side */}
        <article className="flex flex-col w-full lg:w-3/5 gap-7">
          <Suspense
            fallback={
              <div className="h-40 bg-gray-100 rounded-lg animate-pulse dark:bg-gray-700" />
            }
          >
            <ResultDisplay />
            <RiskRewardVisual />
            <RiskRewardSimulator />
            <GrowthSimulator />
          </Suspense>
        </article>
      </section>
    </div>
  );
};

export default Home;
