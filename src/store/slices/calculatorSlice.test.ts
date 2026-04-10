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
      expectedRR: 0,
    });
    expect(initialState.calculationResult).toBeNull();
    expect(initialState.error).toBeNull();
  });

  it("should handle updateTradeParameter", () => {
    const action = updateTradeParameter({ name: "totalCapital", value: 10000 });
    const state = calculatorReducer(undefined, action);

    expect(state.tradeParameters.totalCapital).toBe(10000);
  });

  it("should auto-update takeProfitPrice when expectedRR is updated", () => {
    const store = configureStore({
      reducer: { calculator: calculatorReducer },
    });

    store.dispatch(updateTradeParameter({ name: "entryPrice", value: 100 }));
    store.dispatch(updateTradeParameter({ name: "stopLossPrice", value: 90 }));
    store.dispatch(updateTradeParameter({ name: "expectedRR", value: 2 }));

    const state = store.getState().calculator;
    // For 1:2 RR on 100 entry / 90 stop (distance 10), TP should be 120
    expect(state.tradeParameters.takeProfitPrice).toBe(120);
    expect(state.tradeParameters.expectedRR).toBe(2);
  });

  it("should auto-update expectedRR when takeProfitPrice is updated", () => {
    const store = configureStore({
      reducer: { calculator: calculatorReducer },
    });

    store.dispatch(updateTradeParameter({ name: "entryPrice", value: 100 }));
    store.dispatch(updateTradeParameter({ name: "stopLossPrice", value: 90 }));
    store.dispatch(updateTradeParameter({ name: "takeProfitPrice", value: 130 }));

    const state = store.getState().calculator;
    // Distance 10 SL, Distance 30 TP -> 1:3 RR
    expect(state.tradeParameters.expectedRR).toBe(3);
  });

  it("should update expectedRR when entry/stop change while keeping TP fixed", () => {
    const store = configureStore({
      reducer: { calculator: calculatorReducer },
    });

    // Initial setup: 100 entry, 90 stop, 120 TP (1:2 RR)
    store.dispatch(updateTradeParameter({ name: "entryPrice", value: 100 }));
    store.dispatch(updateTradeParameter({ name: "stopLossPrice", value: 90 }));
    store.dispatch(updateTradeParameter({ name: "takeProfitPrice", value: 120 }));
    expect(store.getState().calculator.tradeParameters.expectedRR).toBe(2);

    // Change SL to 95. Distance becomes 5. TP is still 120. Distance becomes 20. 20/5 = 4
    store.dispatch(updateTradeParameter({ name: "stopLossPrice", value: 95 }));

    const state = store.getState().calculator;
    expect(state.tradeParameters.takeProfitPrice).toBe(120);
    expect(state.tradeParameters.expectedRR).toBe(4);
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
