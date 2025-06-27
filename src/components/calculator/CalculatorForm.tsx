import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import {
  calculatePosition,
  updateTradeParameter,
} from "../../store/slices/calculatorSlice";
import type { TradeParameters } from "../../types";
import { useTranslation } from "react-i18next";
import { processFormValues, saveToLocalStorage } from "../../utils/utils";

const CalculatorForm = () => {
  const { tradeParameters } = useSelector(
    (state: RootState) => state.calculator
  );
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // Local form state for handling input
  const [formValues, setFormValues] = useState({
    totalCapital: tradeParameters.totalCapital?.toString() || "",
    entryPrice: tradeParameters.entryPrice?.toString() || "",
    stopLossPrice: tradeParameters.stopLossPrice?.toString() || "",
    riskPercentage: tradeParameters.riskPercentage?.toString() || "",
    takeProfitPrice: tradeParameters.takeProfitPrice?.toString() || "",
  });

  useEffect(() => {
    setFormValues({
      totalCapital: tradeParameters.totalCapital?.toString() || "",
      entryPrice: tradeParameters.entryPrice?.toString() || "",
      stopLossPrice: tradeParameters.stopLossPrice?.toString() || "",
      riskPercentage: tradeParameters.riskPercentage?.toString() || "",
      takeProfitPrice: tradeParameters.takeProfitPrice?.toString() || "",
    });
  }, [tradeParameters]);

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

  const updateStoreParameters = () => {
    // Parse and dispatch each form value with appropriate validation
    processFormValues(formValues, (paramName, value) => {
      if (paramName === "totalCapital" || paramName === "riskPercentage")
        return;

      saveToLocalStorage(paramName, value === null ? "0" : value.toString());
      dispatch(
        updateTradeParameter({
          name: paramName as keyof TradeParameters,
          value: value,
        })
      );
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateStoreParameters();
    const { totalCapital, riskPercentage } = formValues;

    dispatch(
      calculatePosition({
        totalCapital: parseFloat(totalCapital),
        riskPercentage: parseFloat(riskPercentage),
      })
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div className="form-group">
          <label
            htmlFor="totalCapital"
            id="totalCapitalLabel"
            className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            {t("calculator.totalCapital")}
          </label>
          <input
            type="tel"
            inputMode="decimal"
            pattern="(0|[1-9]\d*)([.,]\d*)?"
            id="totalCapital"
            name="totalCapital"
            min="0"
            required
            aria-labelledby="totalCapitalLabel"
            aria-required="true"
            value={formValues.totalCapital || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm dark:border-gray-400 dark:bg-gray-200 dark:text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div className="form-group">
          <label
            htmlFor="entryPrice"
            id="entryPriceLabel"
            className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            {t("calculator.entryPrice")}
          </label>
          <input
            type="tel"
            inputMode="decimal"
            pattern="(0|[1-9]\d*)([.,]\d*)?"
            id="entryPrice"
            name="entryPrice"
            min="0"
            required
            aria-labelledby="entryPriceLabel"
            aria-required="true"
            value={formValues.entryPrice || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm dark:border-gray-400 dark:bg-gray-200 dark:text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div className="form-group">
          <label
            htmlFor="stopLossPrice"
            id="stopLossPriceLabel"
            className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            {t("calculator.stopLossPrice")}
          </label>
          <input
            type="tel"
            inputMode="decimal"
            pattern="(0|[1-9]\d*)([.,]\d*)?"
            id="stopLossPrice"
            name="stopLossPrice"
            min="0"
            required
            aria-labelledby="stopLossPriceLabel"
            aria-required="true"
            value={formValues.stopLossPrice || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm dark:border-gray-400 dark:bg-gray-200 dark:text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div className="form-group">
          <label
            htmlFor="riskPercentage"
            id="riskPercentageLabel"
            className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            {t("calculator.riskPercentage")}
          </label>
          <input
            type="tel"
            inputMode="decimal"
            pattern="(0|[1-9]\d*)([.,]\d*)?"
            id="riskPercentage"
            name="riskPercentage"
            min="0"
            max="100"
            required
            aria-labelledby="riskPercentageLabel"
            aria-required="true"
            value={formValues.riskPercentage || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm dark:border-gray-400 dark:bg-gray-200 dark:text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div className="form-group">
          <label
            htmlFor="takeProfitPrice"
            id="takeProfitPriceLabel"
            className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            {t("calculator.takeProfitPrice")}
          </label>
          <input
            type="tel"
            inputMode="decimal"
            pattern="(0|[1-9]\d*)([.,]\d*)?"
            id="takeProfitPrice"
            name="takeProfitPrice"
            min="0"
            aria-labelledby="takeProfitPriceLabel"
            value={formValues.takeProfitPrice || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm dark:border-gray-400 dark:bg-gray-200 dark:text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div className="mt-6">
          <button
            type="submit"
            aria-label="Calculate Position Size"
            className="w-full px-4 py-3 font-medium text-white transition-all duration-150 bg-blue-500 rounded-md shadow-sm hover:bg-blue-700 active:bg-blue-800 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 touch-manipulation"
          >
            {t("calculator.calculateButton")}
          </button>
        </div>
      </form>
    </>
  );
};

export default CalculatorForm;
