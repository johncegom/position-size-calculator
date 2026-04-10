import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { TradeParameters, CalculatorState } from "../../types";
import {
  calculatePositionSize,
  calculateTakeProfitPrice,
} from "../../utils/calculations";

export const initialCalculatorState: CalculatorState = {
  tradeParameters: {
    totalCapital: 0,
    riskPercentage: 1,
    entryPrice: 0,
    stopLossPrice: 0,
    takeProfitPrice: null,
    expectedRR: 0,
  },
  calculationResult: null,
  isLoading: false,
  error: null,
};

const calculatorSlice = createSlice({
  name: "calculator",
  initialState: initialCalculatorState,
  reducers: {
    updateTradeParameter: (
      state,
      action: PayloadAction<{
        name: keyof TradeParameters;
        value: number | null;
      }>,
    ) => {
      const { name, value } = action.payload;

      // Update the parameter
      state.tradeParameters = {
        ...state.tradeParameters,
        [name]: value,
      };

      const { entryPrice, stopLossPrice, takeProfitPrice } =
        state.tradeParameters;

      // 1. If Expected R/R is edited -> Update Take Profit Price
      if (
        name === "expectedRR" &&
        value !== null &&
        value > 0 &&
        entryPrice > 0 &&
        stopLossPrice > 0
      ) {
        try {
          state.tradeParameters.takeProfitPrice = calculateTakeProfitPrice(
            entryPrice,
            stopLossPrice,
            value,
          );
        } catch {
          /* ignore */
        }
      }
      // 2. If Take Profit Price is edited -> Update Expected R/R
      else if (
        name === "takeProfitPrice" &&
        value !== null &&
        value > 0 &&
        entryPrice > 0 &&
        stopLossPrice > 0
      ) {
        const stopLossDistance = Math.abs(stopLossPrice - entryPrice);
        const takeProfitDistance = Math.abs(value - entryPrice);
        if (stopLossDistance > 0.0000000001) {
          const rawRR = takeProfitDistance / stopLossDistance;
          state.tradeParameters.expectedRR = Math.round(rawRR * 100) / 100;
        }
      }
      // 3. If Entry or Stop Loss changes -> Keep TP fixed, Update Expected R/R to show new reality
      else if (
        (name === "entryPrice" || name === "stopLossPrice") &&
        entryPrice > 0 &&
        stopLossPrice > 0 &&
        takeProfitPrice != null &&
        takeProfitPrice > 0
      ) {
        const stopLossDistance = Math.abs(stopLossPrice - entryPrice);
        const takeProfitDistance = Math.abs(takeProfitPrice - entryPrice);
        if (stopLossDistance > 0.0000000001) {
          const rawRR = takeProfitDistance / stopLossDistance;
          state.tradeParameters.expectedRR = Math.round(rawRR * 100) / 100;
        }
      }
    },

    calculatePosition: (
      state,
      action: PayloadAction<Partial<TradeParameters> | undefined>,
    ) => {
      try {
        const params = {
          ...state.tradeParameters,
          ...(action.payload || {}),
        };

        const {
          totalCapital,
          riskPercentage,
          entryPrice,
          stopLossPrice,
          takeProfitPrice,
        } = params;

        const result = calculatePositionSize({
          totalCapital,
          riskPercentage,
          entryPrice,
          stopLossPrice,
          takeProfitPrice,
          expectedRR: params.expectedRR,
        });

        state.calculationResult = result;
        state.error = null;
      } catch (error) {
        state.error =
          error instanceof Error ? error.message : "Calculation failed";
        state.calculationResult = null;
      }
    },
  },
});

export const { updateTradeParameter, calculatePosition } =
  calculatorSlice.actions;

export default calculatorSlice.reducer;
