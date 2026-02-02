import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useCalculator } from "./useCalculator";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import calculatorReducer from "../store/slices/calculatorSlice";
import type { ReactNode, ChangeEvent, FormEvent } from "react";

// Mock i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock utils
vi.mock("../utils/utils", () => ({
  processFormValues: vi.fn(
    (
      values: Record<string, string>,
      cb: (k: string, v: number | null) => void,
    ) => {
      Object.entries(values).forEach(([k, v]) =>
        cb(k, v === "" ? null : Number(v)),
      );
    },
  ),
  saveToLocalStorage: vi.fn(),
}));

describe("useCalculator", () => {
  let store: ReturnType<
    typeof configureStore<{ calculator: ReturnType<typeof calculatorReducer> }>
  >;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        calculator: calculatorReducer,
      },
    });
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  it("should initialize with values from store", () => {
    const { result } = renderHook(() => useCalculator(), { wrapper });
    expect(result.current.formValues.riskPercentage).toBe("1");
    expect(result.current.formValues.totalCapital).toBe("0");
  });

  it("should handle input change", () => {
    const { result } = renderHook(() => useCalculator(), { wrapper });

    act(() => {
      result.current.handleInputChange({
        target: { name: "totalCapital", value: "5000" },
      } as unknown as ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.formValues.totalCapital).toBe("5000");
  });

  it("should toggle risk mode", () => {
    const { result } = renderHook(() => useCalculator(), { wrapper });

    expect(result.current.riskInputMode).toBe("percentage");

    act(() => {
      result.current.toggleRiskMode();
    });

    expect(result.current.riskInputMode).toBe("value");
  });

  it("should calculate correctly on submit", () => {
    const { result } = renderHook(() => useCalculator(), { wrapper });

    act(() => {
      result.current.handleInputChange({
        target: { name: "totalCapital", value: "10000" },
      } as unknown as ChangeEvent<HTMLInputElement>);
      result.current.handleInputChange({
        target: { name: "riskPercentage", value: "1" },
      } as unknown as ChangeEvent<HTMLInputElement>);
      result.current.handleInputChange({
        target: { name: "entryPrice", value: "100" },
      } as unknown as ChangeEvent<HTMLInputElement>);
      result.current.handleInputChange({
        target: { name: "stopLossPrice", value: "90" },
      } as unknown as ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as FormEvent<HTMLFormElement>);
    });

    const state = store.getState().calculator;
    expect(state.calculationResult).not.toBeNull();
    expect(state.calculationResult?.positionSize).toBe(1000);
  });

  it("should calculate correctly based on dollar amount in value mode", () => {
    const { result } = renderHook(() => useCalculator(), { wrapper });

    act(() => {
      result.current.handleInputChange({
        target: { name: "totalCapital", value: "10000" },
      } as unknown as ChangeEvent<HTMLInputElement>);
      result.current.toggleRiskMode(); // set to value mode
    });

    act(() => {
      result.current.handleRiskInputChange({
        target: { name: "riskValue", value: "200" },
      } as unknown as ChangeEvent<HTMLInputElement>);
    });

    // $200 of $10000 is 2%
    expect(result.current.formValues.riskPercentage).toBe("2");
  });

  it("should reset to defaults", () => {
    const { result } = renderHook(() => useCalculator(), { wrapper });

    act(() => {
      result.current.handleInputChange({
        target: { name: "totalCapital", value: "99999" },
      } as unknown as ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.formValues.totalCapital).toBe("99999");

    act(() => {
      result.current.handleResetToDefaults();
    });

    // Default totalCapital in store is 0
    expect(result.current.formValues.totalCapital).toBe("0");
  });

  it("should ignore invalid numeric input", () => {
    const { result } = renderHook(() => useCalculator(), { wrapper });

    act(() => {
      result.current.handleInputChange({
        target: { name: "totalCapital", value: "abc" },
      } as unknown as ChangeEvent<HTMLInputElement>);
    });

    // Should stay "0" (or whatever it was)
    expect(result.current.formValues.totalCapital).toBe("0");
  });
});
