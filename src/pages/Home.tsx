import { useTranslation } from "react-i18next";
import CalculatorForm from "../components/calculator/CalculatorForm";
import ResultDisplay from "../components/calculator/ResultDisplay";
import RiskRewardVisual from "../components/calculator/RiskRewardVisual";

const Home = () => {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto px-4 py-6">
      <header className="mb-6 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          {t("calculator.title")}
        </h1>
        <p className="mt-2 text-gray-600">{t("calculator.subtitle")}</p>
      </header>

      <section className="flex flex-col lg:flex-row gap-6">
        {/* Left side */}
        <aside className="w-full lg:w-2/5">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <CalculatorForm />
          </div>
        </aside>

        {/* Right side */}
        <article className="w-full lg:w-3/5">
          <ResultDisplay />
          <RiskRewardVisual />
        </article>
      </section>
    </div>
  );
};

export default Home;
