import React, { type ReactElement } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import calculatorReducer, { initialCalculatorState } from "./store/slices/calculatorSlice";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { MemoryRouter } from "react-router-dom";

import type { RootState } from "./store/store";
import type { Store, Reducer, UnknownAction } from "@reduxjs/toolkit";
import type { CalculatorState, TradeParameters, CalculationResult } from "./types";

// Standard Redux + I18n provider wrapper for components
// Allows overriding the state for specific tests
interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: {
    calculator?: {
      tradeParameters?: Partial<TradeParameters>;
      calculationResult?: Partial<CalculationResult> | null;
      isLoading?: boolean;
      error?: string | null;
    };
  };
  store?: Store<RootState>;
}

function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    // Merge provided partial state with initial state to ensure strict Redux types are met
    store = configureStore({
      reducer: {
        calculator: calculatorReducer as Reducer<
          CalculatorState,
          UnknownAction,
          CalculatorState | undefined
        >,
      },
      preloadedState: {
        calculator: {
          ...initialCalculatorState,
          ...preloadedState.calculator,
          tradeParameters: {
            ...initialCalculatorState.tradeParameters,
            ...(preloadedState.calculator?.tradeParameters || {}),
          },
        },
      } as RootState,
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  function Wrapper({ children }: { children: React.ReactNode }): ReactElement {
    return (
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <MemoryRouter>{children}</MemoryRouter>
        </I18nextProvider>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export { renderWithProviders };
