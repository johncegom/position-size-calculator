import { describe, it, expect } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import calculatorReducer, {
  updateTradeParameter,
  calculatePosition,
} from "./calculatorSlice";

describe("calculatorSlice", () => {
  it("should handle initial state", () => {
    const initialState = calculatorReducer(undefined, { type: "unknown" });
    expect(initialState.tradeParameters).toEqual({
      totalCapital: 0,
      riskPercentage: 1,
      entryPrice: 0,
      stopLossPrice: 0,
      takeProfitPrice: null,
    });
    expect(initialState.calculationResult).toBeNull();
    expect(initialState.error).toBeNull();
  });

  it("should handle updateTradeParameter", () => {
    const prevState = calculatorReducer(undefined, { type: "unknown" });
    const action = updateTradeParameter({ name: "totalCapital", value: 10000 });
    const state = calculatorReducer(prevState, action);

    expect(state.tradeParameters.totalCapital).toBe(10000);
  });

  it("should handle calculatePosition with valid parameters", () => {
    const prevState = calculatorReducer(undefined, { type: "unknown" });
    const params = {
      totalCapital: 10000,
      riskPercentage: 2,
      entryPrice: 100,
      stopLossPrice: 95,
      takeProfitPrice: 110,
    };

    // We can either update parameters first or pass them to calculatePosition
    const stateWithParams = calculatorReducer(
      prevState,
      updateTradeParameter({ name: "totalCapital", value: 10000 }),
    );

    const action = calculatePosition(params);
    const state = calculatorReducer(stateWithParams, action);

    expect(state.calculationResult).not.toBeNull();
    expect(state.calculationResult?.positionSize).toBe(4000);
    expect(state.error).toBeNull();
  });

  it("should handle calculation error (e.g. entry === stoploss)", () => {
    const prevState = calculatorReducer(undefined, { type: "unknown" });
    const params = {
      totalCapital: 10000,
      riskPercentage: 2,
      entryPrice: 100,
      stopLossPrice: 100,
    };

    const action = calculatePosition(params);
    const state = calculatorReducer(prevState, action);

    expect(state.calculationResult).toBeNull();
    expect(state.error).toBe(
      "Entry price and stop loss price cannot be equal.",
    );
  });

  it("should use state parameters if none provided to calculatePosition", () => {
    const store = configureStore({
      reducer: { calculator: calculatorReducer },
    });

    store.dispatch(updateTradeParameter({ name: "totalCapital", value: 1000 }));
    store.dispatch(updateTradeParameter({ name: "riskPercentage", value: 1 }));
    store.dispatch(updateTradeParameter({ name: "entryPrice", value: 10 }));
    store.dispatch(updateTradeParameter({ name: "stopLossPrice", value: 9 }));

    store.dispatch(calculatePosition());

    const state = store.getState().calculator;
    expect(state.calculationResult).not.toBeNull();
    expect(state.calculationResult?.positionSize).toBe(100);
  });
});
