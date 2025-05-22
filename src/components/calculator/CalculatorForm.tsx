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

    const normalizedValue = value.replace(",", ".");

    if (normalizedValue === "" || /^(0|[1-9]\d*)([.,]\d*)?$/.test(value)) {
      setFormValues((prev) => {
        return {
          ...prev,
          [name]: normalizedValue,
        };
      });
    }
  };

  /**
   * Updates the trade parameters in the Redux store based on current form values.
   *
   * This function iterates through all form values, converts them from strings to
   * appropriate numeric values, and dispatches actions to update the store.
   *
   * Special handling is provided for the takeProfitPrice parameter, which is optional
   * and can be set to null when empty. All other empty values default to 0.
   */
  const updateStoreParameters = () => {
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
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateStoreParameters();
    dispatch(calculatePosition());
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div className="form-group">
          <label
            htmlFor="totalCapital"
            id="totalCapitalLabel"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Total Trading Capital ($)
          </label>
          <input
            type="tel"
            inputMode="decimal"
            pattern="(0|[1-9]\d*)([.,]\d*)?"
            id="totalCapital"
            name="totalCapital"
            min="0"
            step="0.01"
            required
            aria-labelledby="totalCapitalLabel"
            aria-required="true"
            value={formValues.totalCapital || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div className="form-group">
          <label
            htmlFor="entryPrice"
            id="entryPriceLabel"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Entry Price ($)
          </label>
          <input
            type="tel"
            inputMode="decimal"
            pattern="(0|[1-9]\d*)([.,]\d*)?"
            id="entryPrice"
            name="entryPrice"
            min="0"
            step="0.0001"
            required
            aria-labelledby="entryPriceLabel"
            aria-required="true"
            value={formValues.entryPrice || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div className="form-group">
          <label
            htmlFor="stopLossPrice"
            id="stopLossPriceLabel"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Stop-Loss Price ($)
          </label>
          <input
            type="tel"
            inputMode="decimal"
            pattern="(0|[1-9]\d*)([.,]\d*)?"
            id="stopLossPrice"
            name="stopLossPrice"
            min="0"
            step="0.0001"
            required
            aria-labelledby="stopLossPriceLabel"
            aria-required="true"
            value={formValues.stopLossPrice || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div className="form-group">
          <label
            htmlFor="riskPercentage"
            id="riskPercentageLabel"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Risk Percentage (%)
          </label>
          <input
            type="tel"
            inputMode="decimal"
            pattern="(0|[1-9]\d*)([.,]\d*)?"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div className="form-group">
          <label
            htmlFor="takeProfitPrice"
            id="takeProfitPriceLabel"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Take-Profit Price ($) (Optional)
          </label>
          <input
            type="tel"
            inputMode="decimal"
            pattern="(0|[1-9]\d*)([.,]\d*)?"
            id="takeProfitPrice"
            name="takeProfitPrice"
            min="0"
            step="0.0001"
            aria-labelledby="takeProfitPriceLabel"
            value={formValues.takeProfitPrice || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div className="mt-6">
          <button
            type="submit"
            aria-label="Calculate Position Size"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Calculate
          </button>
        </div>
      </form>

      {calculationResult?.positionSize && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
          <p className="text-gray-700">
            <span className="font-medium">Position Size:</span>{" "}
            <span className="text-blue-600 font-bold">
              {calculationResult.positionSize}
            </span>
          </p>
        </div>
      )}
    </>
  );
};

export default CalculatorForm;
