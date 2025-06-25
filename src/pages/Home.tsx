import { useTranslation } from "react-i18next";
import CalculatorForm from "../components/calculator/CalculatorForm";
import ResultDisplay from "../components/calculator/ResultDisplay";
import RiskRewardVisual from "../components/calculator/RiskRewardVisual";
import RiskRewardSimulator from "../components/calculator/RiskRewardSimulator";

const Home = () => {
  const { t } = useTranslation();
  return (
    <div className="container min-h-screen px-4 py-6 mx-auto bg-white dark:bg-gray-800">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800 cursor-default dark:text-gray-50 md:text-3xl">
          {t("calculator.title")}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-200">
          {t("calculator.subtitle")}
        </p>
      </header>

      <section className="flex flex-col gap-6 lg:flex-row">
        {/* Left side */}
        <aside className="w-full lg:w-2/5">
          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-400">
            <CalculatorForm />
          </div>
        </aside>

        {/* Right side */}
        <article className="flex flex-col w-full lg:w-3/5 gap-7">
          <ResultDisplay />
          <RiskRewardVisual />
          <RiskRewardSimulator />
        </article>
      </section>
    </div>
  );
};

export default Home;
