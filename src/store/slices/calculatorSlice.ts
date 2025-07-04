import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { TradeParameters, CalculatorState } from "../../types";
import { calculatePositionSize } from "../../utils/calculations";

const initialCalculatorState: CalculatorState = {
  tradeParameters: {
    totalCapital: 0,
    riskPercentage: 1,
    entryPrice: 0,
    stopLossPrice: 0,
    takeProfitPrice: null,
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
      }>
    ) => {
      const { name, value } = action.payload;
      state.tradeParameters = {
        ...state.tradeParameters,
        [name]: value,
      };
    },

    calculatePosition: (
      state,
      action: PayloadAction<Partial<TradeParameters> | undefined>
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
