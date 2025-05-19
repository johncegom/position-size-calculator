import type { TradeParameters } from "../../types";

// Consider:
// - What parameters should be accepted from the user?
// - How will form validation work?
// - Should we include default values?

interface CalculatorFormProps {
  // TODO: Define how calculated values will be passed to parent components
}

const CalculatorForm = (props: CalculatorFormProps) => {
  return (
    <form>
      <div>
        <label htmlFor="totalCapital" id="totalCapitalLabel">
          Total Trading Capital ($)
        </label>
        <input
          type="number"
          id="totalCapital"
          name="totalCapital"
          min="0"
          step="0.01"
          required
          aria-labelledby="totalCapitalLabel"
          aria-required="true"
        />
      </div>

      <div>
        <label htmlFor="entryPrice" id="entryPriceLabel">
          Entry Price ($)
        </label>
        <input
          type="number"
          id="entryPrice"
          name="entryPrice"
          min="0"
          step="0.0001"
          required
          aria-labelledby="entryPriceLabel"
          aria-required="true"
        />
      </div>

      <div>
        <label htmlFor="stopLossPrice" id="stopLossPriceLabel">
          Stop-Loss Price ($)
        </label>
        <input
          type="number"
          id="stopLossPrice"
          name="stopLossPrice"
          min="0"
          step="0.0001"
          required
          aria-labelledby="stopLossPriceLabel"
          aria-required="true"
        />
      </div>

      <div>
        <label htmlFor="riskPercentage" id="riskPercentageLabel">
          Risk Percentage (%)
        </label>
        <input
          type="number"
          id="riskPercentage"
          name="riskPercentage"
          min="0"
          max="100"
          step="0.1"
          required
          aria-labelledby="riskPercentageLabel"
          aria-required="true"
        />
      </div>

      <div>
        <label htmlFor="takeProfitPrice" id="takeProfitPriceLabel">
          Take-Profit Price ($) (Optional)
        </label>
        <input
          type="number"
          id="takeProfitPrice"
          name="takeProfitPrice"
          min="0"
          step="0.0001"
          aria-labelledby="takeProfitPriceLabel"
        />
      </div>

      <div>
        <button type="submit" aria-label="Calculate Position Size">
          Calculate Position Size
        </button>
      </div>
    </form>
  );
};

export default CalculatorForm;
