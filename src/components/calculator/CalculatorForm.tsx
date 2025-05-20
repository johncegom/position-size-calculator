import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import type { ChangeEvent, FormEvent } from "react";
import {
  calculatePosition,
  updateTradeParameter,
} from "../../store/slices/calculatorSlice";
import type { TradeParameters } from "../../types";

const CalculatorForm = () => {
  const { tradeParameters, calculationResult } = useSelector(
    (state: RootState) => state.calculator
  );
  const dispatch = useDispatch();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const parsedValue =
      value === ""
        ? name === "takeProfitPrice"
          ? null
          : 0
        : parseFloat(value);

    dispatch(
      updateTradeParameter({
        name: name as keyof TradeParameters,
        value: parsedValue,
      })
    );
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(calculatePosition());
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="totalCapital" id="totalCapitalLabel">
            Total Trading Capital ($)
          </label>
          <input
            type="tel"
            inputMode="decimal"
            pattern="(0|[1-9]\d*)(\.\d{0,2})?"
            id="totalCapital"
            name="totalCapital"
            min="0"
            step="0.01"
            required
            aria-labelledby="totalCapitalLabel"
            aria-required="true"
            value={tradeParameters.totalCapital || ""}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="entryPrice" id="entryPriceLabel">
            Entry Price ($)
          </label>
          <input
            type="tel"
            inputMode="decimal"
            pattern="(0|[1-9]\d*)(\.\d{0,2})?"
            id="entryPrice"
            name="entryPrice"
            min="0"
            step="0.0001"
            required
            aria-labelledby="entryPriceLabel"
            aria-required="true"
            value={tradeParameters.entryPrice || ""}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="stopLossPrice" id="stopLossPriceLabel">
            Stop-Loss Price ($)
          </label>
          <input
            type="tel"
            inputMode="decimal"
            pattern="(0|[1-9]\d*)(\.\d{0,2})?"
            id="stopLossPrice"
            name="stopLossPrice"
            min="0"
            step="0.0001"
            required
            aria-labelledby="stopLossPriceLabel"
            aria-required="true"
            value={tradeParameters.stopLossPrice || ""}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="riskPercentage" id="riskPercentageLabel">
            Risk Percentage (%)
          </label>
          <input
            type="tel"
            inputMode="decimal"
            pattern="(0|[1-9]\d*)(\.\d{0,2})?"
            id="riskPercentage"
            name="riskPercentage"
            min="0"
            max="100"
            step="0.1"
            required
            aria-labelledby="riskPercentageLabel"
            aria-required="true"
            value={tradeParameters.riskPercentage || ""}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="takeProfitPrice" id="takeProfitPriceLabel">
            Take-Profit Price ($) (Optional)
          </label>
          <input
            type="tel"
            inputMode="decimal"
            pattern="(0|[1-9]\d*)(\.\d{0,2})?"
            id="takeProfitPrice"
            name="takeProfitPrice"
            min="0"
            step="0.0001"
            aria-labelledby="takeProfitPriceLabel"
            value={tradeParameters.takeProfitPrice || ""}
            onChange={handleInputChange}
          />
        </div>

        <div className="mt-4">
          <button
            type="submit"
            aria-label="Calculate Position Size"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          >
            Calculate
          </button>
        </div>
      </form>
      <div className="mt-5">
        <p>
          Result: <span>{calculationResult?.positionSize}</span>
        </p>
      </div>
    </>
  );
};

export default CalculatorForm;
