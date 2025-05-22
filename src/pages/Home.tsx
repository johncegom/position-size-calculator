import CalculatorForm from "../components/calculator/CalculatorForm";
import ResultDisplay from "../components/calculator/ResultDisplay";
import RiskRewardVisual from "../components/calculator/RiskRewardVisual";

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <header className="mb-6 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Position Size Calculator
        </h1>
        <p className="mt-2 text-gray-600">
          Calculate optimal trade sizes based on your risk tolerance
        </p>
      </header>

      <section className="flex flex-col lg:flex gap-6">
        <aside className="w-full lg:w-2/5">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <CalculatorForm />
          </div>
        </aside>

        <article className="w-full lg:w-3/5">
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Calculation Results</h2>
            <ResultDisplay />
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Risk/Reward Analysis</h2>
            <RiskRewardVisual />
          </div>
        </article>
      </section>
    </div>
  );
};

export default Home;
