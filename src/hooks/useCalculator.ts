import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import {
  calculatePosition,
  updateTradeParameter,
} from "../store/slices/calculatorSlice";
import { processFormValues, saveToLocalStorage } from "../utils/utils";
import { formatToTwoDecimals } from "../utils/formatters";
import type { TradeParameters } from "../types";

const INPUT_VALIDATION_REGEX = /^(0|[1-9]\d*)([.,]\d*)?$/;

/**
 * Custom hook to manage position size calculator form state and submission.
 * Optimized following Vercel React Best Practices for re-render performance
 * and state distribution.
 */
export const useCalculator = () => {
  const { tradeParameters } = useSelector(
    (state: RootState) => state.calculator,
  );
  const dispatch = useDispatch();

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

  // Use refs for stable access in memoized callbacks without triggering re-renders
  const formValuesRef = useRef(formValues);
  formValuesRef.current = formValues;

  const prevTradeParamsRef = useRef(tradeParameters);

  /**
   * Toggles between percentage (%) and fixed dollar ($) risk input modes.
   */
  const toggleRiskMode = useCallback(() => {
    setRiskInputMode((prev) =>
      prev === "percentage" ? "value" : "percentage",
    );
  }, []);

  /**
   * Derived value for display in the risk input field based on current mode.
   * Memoized to prevent recalculation unless mode or values change.
   */
  const riskInputValue = useMemo(() => {
    if (riskInputMode === "percentage") {
      return formValues.riskPercentage;
    }

    if (formValues.riskPercentage === "") return "";

    const capital = parseFloat(formValues.totalCapital) || 0;
    const percent = parseFloat(formValues.riskPercentage) || 0;

    if (capital === 0) return "";

    const value = (capital * percent) / 100;
    return formatToTwoDecimals(value).toString();
  }, [riskInputMode, formValues.riskPercentage, formValues.totalCapital]);

  /**
   * Specialized handler for risk input that converts between mode-specific values
   * and the canonical percentage state.
   */
  const handleRiskInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(",", ".");
      if (!INPUT_VALIDATION_REGEX.test(value) && value !== "") return;

      setFormValues((prev) => {
        if (riskInputMode === "percentage") {
          return { ...prev, riskPercentage: value };
        } else {
          const dollarAmount = parseFloat(value);
          const capital = parseFloat(prev.totalCapital) || 0;

          if (value === "") {
            return { ...prev, riskPercentage: "" };
          }

          if (capital > 0) {
            const calculatedPercent = (dollarAmount / capital) * 100;
            return { ...prev, riskPercentage: calculatedPercent.toString() };
          }
          return prev;
        }
      });
    },
    [riskInputMode],
  );

  /**
   * Sync local form state with Redux store when parameters are updated externally
   * (e.g., through a settings modal or global defaults).
   */
  useEffect(() => {
    const prevParams = prevTradeParamsRef.current;

    setFormValues((currentFormValues) => {
      const newValues = { ...currentFormValues };
      let hasChanges = false;

      (Object.keys(tradeParameters) as Array<keyof TradeParameters>).forEach(
        (key) => {
          if (tradeParameters[key] !== prevParams[key]) {
            const storeValue = tradeParameters[key];
            const stringValue = storeValue?.toString() || "";

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

  /**
   * Resets session-specific overrides (Capital, Risk%) back to global defaults.
   */
  const handleResetToDefaults = useCallback(() => {
    setFormValues((prev) => ({
      ...prev,
      totalCapital: tradeParameters.totalCapital?.toString() || "",
      riskPercentage: tradeParameters.riskPercentage?.toString() || "",
    }));
  }, [tradeParameters.totalCapital, tradeParameters.riskPercentage]);

  /**
   * Generic handler for standard numeric input fields.
   */
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const normalizedValue = value.replace(",", ".");

    if (normalizedValue === "" || INPUT_VALIDATION_REGEX.test(value)) {
      setFormValues((prev) => ({
        ...prev,
        [name]: normalizedValue,
      }));
    }
  }, []);

  /**
   * Processes form submission:
   * 1. Updates global defaults (excluding session overrides).
   * 2. Persists settings to storage.
   * 3. Calculates final position results.
   */
  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const currentValues = formValuesRef.current;

      processFormValues(currentValues, (paramName, value) => {
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

      const { totalCapital, riskPercentage } = currentValues;

      dispatch(
        calculatePosition({
          totalCapital: parseFloat(totalCapital),
          riskPercentage: parseFloat(riskPercentage),
        }),
      );
    },
    [dispatch],
  );

  return {
    formValues,
    riskInputMode,
    riskInputValue,
    toggleRiskMode,
    handleInputChange,
    handleRiskInputChange,
    handleResetToDefaults,
    handleSubmit,
    tradeParameters,
  };
};
