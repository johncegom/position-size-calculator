import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useState, type ChangeEvent, type FormEvent } from "react";
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

  // Local form state for handling input
  const [formValues, setFormValues] = useState({
    totalCapital: tradeParameters.totalCapital?.toString() || "",
    entryPrice: tradeParameters.entryPrice?.toString() || "",
    stopLossPrice: tradeParameters.stopLossPrice?.toString() || "",
    riskPercentage: tradeParameters.riskPercentage?.toString() || "",
    takeProfitPrice: tradeParameters.takeProfitPrice?.toString() || "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (value === "" || /^(0|[1-9]\d*)(\.\d*)?$/.test(value)) {
      setFormValues((prev) => {
        return {
          ...prev,
          [name]: value,
        };
      });
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Parse and dispatch each form value with appropriate validation
    Object.entries(formValues).forEach(([paramName, strValue]) => {
      const isOptionalTakeProfit = paramName === "takeProfitPrice";

      // Convert to appropriate numeric value or null for optional fields
      const numericValue =
        strValue === ""
          ? isOptionalTakeProfit
            ? null
            : 0
          : parseFloat(strValue);

      // Update the parameter in the store
      dispatch(
        updateTradeParameter({
          name: paramName as keyof TradeParameters,
          value: numericValue,
        })
      );
    });

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
            pattern="(0|[1-9]\d*)(\.\d*)?"
            id="totalCapital"
            name="totalCapital"
            min="0"
            step="0.01"
            required
            aria-labelledby="totalCapitalLabel"
            aria-required="true"
            value={formValues.totalCapital || ""}
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
            pattern="(0|[1-9]\d*)(\.\d*)?"
            id="entryPrice"
            name="entryPrice"
            min="0"
            step="0.0001"
            required
            aria-labelledby="entryPriceLabel"
            aria-required="true"
            value={formValues.entryPrice || ""}
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
            pattern="(0|[1-9]\d*)(\.\d*)?"
            id="stopLossPrice"
            name="stopLossPrice"
            min="0"
            step="0.0001"
            required
            aria-labelledby="stopLossPriceLabel"
            aria-required="true"
            value={formValues.stopLossPrice || ""}
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
            pattern="(0|[1-9]\d*)(\.\d*)?"
            id="riskPercentage"
            name="riskPercentage"
            min="0"
            max="100"
            step="0.1"
            required
            aria-labelledby="riskPercentageLabel"
            aria-required="true"
            value={formValues.riskPercentage || ""}
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
            pattern="(0|[1-9]\d*)(\.\d*)?"
            id="takeProfitPrice"
            name="takeProfitPrice"
            min="0"
            step="0.0001"
            aria-labelledby="takeProfitPriceLabel"
            value={formValues.takeProfitPrice || ""}
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
