import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import {
  useEffect,
  useState,
  useRef,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  calculatePosition,
  updateTradeParameter,
} from "../../store/slices/calculatorSlice";
import type { TradeParameters } from "../../types";
import { useTranslation } from "react-i18next";
import { processFormValues, saveToLocalStorage } from "../../utils/utils";

const INPUT_VALIDATION_REGEX = /^(0|[1-9]\d*)([.,]\d*)?$/;

const CalculatorForm = () => {
  const { tradeParameters } = useSelector(
    (state: RootState) => state.calculator,
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

  const [riskInputMode, setRiskInputMode] = useState<"percentage" | "value">(
    "percentage",
  );

  // Track previous trade parameters to detect external changes (e.g. from Settings)
  const prevTradeParamsRef = useRef(tradeParameters);

  const toggleRiskMode = () => {
    setRiskInputMode((prev) =>
      prev === "percentage" ? "value" : "percentage",
    );
  };

  const getRiskInputValue = () => {
    if (riskInputMode === "percentage") {
      return formValues.riskPercentage;
    }

    // If input is empty, ensure we return empty string so it doesn't snap to "0.00"
    if (formValues.riskPercentage === "") return "";

    // Calculate dollar amount from percentage for display
    const capital = parseFloat(formValues.totalCapital) || 0;
    const percent = parseFloat(formValues.riskPercentage) || 0;

    if (capital === 0) return "";

    const value = (capital * percent) / 100;
    // Return rounded to 2 decimals for display, but keep string to allow typing
    return formatToTwoDecimals(value).toString();
  };

  // Helper to standardise string rounding
  const formatToTwoDecimals = (num: number) => {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  };

  const handleRiskInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(",", ".");
    if (!INPUT_VALIDATION_REGEX.test(value) && value !== "") return;

    if (riskInputMode === "percentage") {
      setFormValues((prev) => ({ ...prev, riskPercentage: value }));
    } else {
      // User is typing dollar value
      const dollarAmount = parseFloat(value);
      const capital = parseFloat(formValues.totalCapital) || 0;

      if (value === "") {
        // Keep percentage as is or clear it? Clearing it is safer.
        setFormValues((prev) => ({ ...prev, riskPercentage: "" }));
        return;
      }

      if (capital > 0) {
        const calculatedPercent = (dollarAmount / capital) * 100;
        // We store the precise percentage, but for display stability we might need to be careful
        // For now, raw calc is best for accuracy
        setFormValues((prev) => ({
          ...prev,
          riskPercentage: calculatedPercent.toString(),
        }));
      }
    }
  };

  useEffect(() => {
    const prevParams = prevTradeParamsRef.current;

    setFormValues((currentFormValues) => {
      const newValues = { ...currentFormValues };
      let hasChanges = false;

      // Only update local form if the STORE value has changed since last render.
      // This prevents local edits (e.g. changing Risk% to 5%) from being reset
      // by unrelated store updates (e.g. changing Entry Price), while still
      // accepting explicit updates from the Settings modal.
      (Object.keys(tradeParameters) as Array<keyof TradeParameters>).forEach(
        (key) => {
          if (tradeParameters[key] !== prevParams[key]) {
            // Special handling for takeProfitPrice which can be null
            const storeValue = tradeParameters[key];
            const stringValue = storeValue?.toString() || "";

            // Only update if different from current form to avoid cursor jumps if possible,
            // though strict sync with store change is safer for "Settings" updates.
            if (newValues[key] !== stringValue) {
              newValues[key] = stringValue;
              hasChanges = true;
            }
          }
        },
      );

      return hasChanges ? newValues : currentFormValues;
    });

    prevTradeParamsRef.current = tradeParameters;
  }, [tradeParameters]);

  const handleResetToDefaults = () => {
    setFormValues((prev) => ({
      ...prev,
      totalCapital: tradeParameters.totalCapital?.toString() || "",
      riskPercentage: tradeParameters.riskPercentage?.toString() || "",
    }));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const normalizedValue = value.replace(",", ".");

    if (normalizedValue === "" || INPUT_VALIDATION_REGEX.test(value)) {
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
      // Do not sync 'Session' values (Capital/Risk) to Store 'Defaults'.
      // These should only be updated via the Settings Modal.
      if (paramName === "totalCapital" || paramName === "riskPercentage")
        return;

      saveToLocalStorage(paramName, value === null ? "0" : value.toString());
      dispatch(
        updateTradeParameter({
          name: paramName as keyof TradeParameters,
          value: value,
        }),
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
      }),
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div className="form-group">
          <label
            htmlFor="totalCapital"
            id="totalCapitalLabel"
            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {t("calculator.totalCapital")}
          </label>
          <div className="relative group">
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
              className="w-full py-3 pl-8 pr-4 text-lg transition-all bg-white border-0 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700/50 rounded-xl dark:bg-slate-900/50 dark:text-white focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 dark:placeholder-gray-600 font-mono input-premium"
              placeholder="0.00"
            />
            <span className="absolute text-gray-400 transform -translate-y-1/2 left-4 top-1/2 dark:text-gray-500 group-focus-within:opacity-20 transition-all duration-300 group-focus-within:-translate-x-1 pointer-events-none">
              $
            </span>
          </div>
        </div>

        <div className="form-group">
          <div className="flex flex-wrap items-baseline justify-between mb-2">
            <label
              htmlFor="riskInput"
              id="riskInputLabel"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {riskInputMode === "percentage"
                ? t("calculator.riskPercentage")
                : t("calculator.riskAmount")}
            </label>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500 dark:text-gray-400">
                {riskInputMode === "percentage"
                  ? `${t("common.riskValue")}: `
                  : `${t("common.riskPercentageShort")}: `}
                <span className="font-bold font-mono text-indigo-600 dark:text-indigo-400">
                  {riskInputMode === "percentage"
                    ? `$${(
                        (parseFloat(formValues.totalCapital || "0") *
                          parseFloat(formValues.riskPercentage || "0")) /
                        100
                      ).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    : `${parseFloat(
                        formValues.riskPercentage || "0",
                      ).toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}%`}
                </span>
              </span>

              <button
                type="button"
                onClick={toggleRiskMode}
                className="p-1 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-indigo-500"
                title="Swap Risk Input Mode"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="relative group">
            <input
              type="tel"
              inputMode="decimal"
              pattern="(0|[1-9]\d*)([.,]\d*)?"
              id="riskInput"
              name={
                riskInputMode === "percentage" ? "riskPercentage" : "riskValue"
              }
              min="0"
              required
              aria-labelledby="riskInputLabel"
              aria-required="true"
              value={getRiskInputValue()}
              onChange={handleRiskInputChange}
              className="w-full px-4 py-3 text-lg transition-all bg-white border-0 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700/50 rounded-xl dark:bg-slate-900/50 dark:text-white focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 dark:placeholder-gray-600 font-mono input-premium"
              placeholder={riskInputMode === "percentage" ? "1.0" : "0.00"}
            />
            <span className="absolute text-gray-400 transform -translate-y-1/2 right-4 top-1/2 dark:text-gray-500 group-focus-within:opacity-20 transition-all duration-300 group-focus-within:translate-x-1">
              {riskInputMode === "percentage" ? "%" : "$"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="form-group">
            <label
              htmlFor="entryPrice"
              id="entryPriceLabel"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t("calculator.entryPrice")}
            </label>
            <div className="relative group">
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
                className="w-full py-3 pl-8 pr-4 text-lg transition-all bg-white border-0 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700/50 rounded-xl dark:bg-slate-900/50 dark:text-white focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 dark:placeholder-gray-600 font-mono input-premium"
                placeholder="0.00"
              />
              <span className="absolute text-gray-400 transform -translate-y-1/2 left-4 top-1/2 dark:text-gray-500 group-focus-within:opacity-20 transition-all duration-300 group-focus-within:-translate-x-1 pointer-events-none">
                $
              </span>
            </div>
          </div>

          <div className="form-group">
            <label
              htmlFor="stopLossPrice"
              id="stopLossPriceLabel"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t("calculator.stopLossPrice")}
            </label>
            <div className="relative group">
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
                className="w-full py-3 pl-8 pr-4 text-lg transition-all bg-white border-0 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700/50 rounded-xl dark:bg-slate-900/50 dark:text-white focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 dark:placeholder-gray-600 font-mono input-premium"
                placeholder="0.00"
              />
              <span className="absolute text-gray-400 transform -translate-y-1/2 left-4 top-1/2 dark:text-gray-500 group-focus-within:opacity-20 transition-all duration-300 group-focus-within:-translate-x-1 pointer-events-none">
                $
              </span>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label
            htmlFor="takeProfitPrice"
            id="takeProfitPriceLabel"
            className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {t("calculator.takeProfitPrice")}{" "}
            <span className="text-gray-400 text-xs font-normal ml-1">
              ({t("common.optional")})
            </span>
          </label>
          <div className="relative group">
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
              className="w-full py-3 pl-8 pr-4 text-lg transition-all bg-white border-0 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700/50 rounded-xl dark:bg-slate-900/50 dark:text-white focus:ring-2 focus:ring-indigo-500 placeholder-gray-400 dark:placeholder-gray-600 font-mono input-premium"
              placeholder="0.00"
            />
            <span className="absolute text-gray-400 transform -translate-y-1/2 left-4 top-1/2 dark:text-gray-500 group-focus-within:opacity-20 transition-all duration-300 group-focus-within:-translate-x-1 pointer-events-none">
              $
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-8">
          <button
            type="submit"
            aria-label="Calculate Position Size"
            className="flex-1 px-6 py-4 text-lg font-bold tracking-wide text-white transition-all transform shadow-lg bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-xl shadow-indigo-500/30 hover:to-indigo-600 hover:shadow-indigo-500/40 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {t("calculator.calculateButton")}
          </button>

          <button
            type="button"
            onClick={handleResetToDefaults}
            aria-label="Reset to Default Settings"
            title="Reset to Default Settings"
            className="p-4 text-gray-500 transition-all bg-white border border-gray-200 shadow-sm dark:bg-dark-card dark:border-gray-700 dark:text-gray-400 rounded-xl hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-800 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
          </button>
        </div>
      </form>
    </>
  );
};

export default CalculatorForm;
