import CalculatorForm from "../components/calculator/CalculatorForm";
import ResultDisplay from "../components/calculator/ResultDisplay";
import RiskRewardVisual from "../components/calculator/RiskRewardVisual";

const Home = () => {
  return (
    <div>
      <header>
        <h1>Position Size Calculator</h1>
      </header>

      <section>
        <aside>
          <CalculatorForm />
        </aside>

        <article>
          <ResultDisplay />
          <RiskRewardVisual />
        </article>
      </section>
    </div>
  );
};

export default Home;
