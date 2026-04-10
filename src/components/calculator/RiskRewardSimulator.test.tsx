import { renderWithProviders } from "../../test-utils";
import { screen } from "@testing-library/react";
import RiskRewardSimulator from "./RiskRewardSimulator";
import { describe, it, expect } from "vitest";

describe("RiskRewardSimulator Component", () => {
  const defaultTradeParams = {
    entryPrice: 100,
    stopLossPrice: 90,
    totalCapital: 10000,
    expectedRR: 0,
  };

  const defaultCalcResult = {
    positionSize: 10,
    potentialLoss: 100,
    potentialProfit: 200,
    riskRewardRatio: 2,
  };

  it("renders nothing if parameters are missing", () => {
    const { container } = renderWithProviders(<RiskRewardSimulator />, {
      preloadedState: {
        calculator: {
          tradeParameters: { ...defaultTradeParams, entryPrice: 0 },
          calculationResult: null,
        },
      },
    });

    expect(container.firstChild).toBeNull();
  });

  it("renders standard scenarios (1:1, 1:2, 1:3) by default", () => {
    renderWithProviders(<RiskRewardSimulator />, {
      preloadedState: {
        calculator: {
          tradeParameters: defaultTradeParams,
          calculationResult: defaultCalcResult,
        },
      },
    });

    expect(screen.getByText("1:1")).toBeInTheDocument();
    expect(screen.getByText("1:2")).toBeInTheDocument();
    expect(screen.getByText("1:3")).toBeInTheDocument();
  });

  it("adds and highlights user expected R/R when set to a custom value", () => {
    renderWithProviders(<RiskRewardSimulator />, {
      preloadedState: {
        calculator: {
          tradeParameters: { ...defaultTradeParams, expectedRR: 2.5 },
          calculationResult: defaultCalcResult,
        },
      },
    });

    // Should have 1, 2, 2.5, 3
    expect(screen.getByText("1:1")).toBeInTheDocument();
    expect(screen.getByText("1:2")).toBeInTheDocument();
    expect(screen.getByText("1:2.50")).toBeInTheDocument();
    expect(screen.getByText("1:3")).toBeInTheDocument();

    // Check for "Expected" badge
    expect(screen.getByText("Your Target")).toBeInTheDocument();
  });

  it("highlights the matching standard scenario when expectedRR matches", () => {
    renderWithProviders(<RiskRewardSimulator />, {
      preloadedState: {
        calculator: {
          tradeParameters: { ...defaultTradeParams, expectedRR: 3 },
          calculationResult: defaultCalcResult,
        },
      },
    });

    // Should NOT have duplicate 1:3.00
    const ratios = screen.getAllByText("1:3");
    expect(ratios.length).toBe(1);

    // Highlight should still exist
    expect(screen.getByText("Your Target")).toBeInTheDocument();
  });

  it("calculates prices correctly based on ratio", () => {
    renderWithProviders(<RiskRewardSimulator />, {
      preloadedState: {
        calculator: {
          tradeParameters: { 
            entryPrice: 100,
            stopLossPrice: 90,
            totalCapital: 10000,
            expectedRR: 0 
          },
          calculationResult: {
            potentialLoss: 100,
            positionSize: 10,
          },
        },
      },
    });

    // 1:2.00 should have a target price of 120 (100 + (100-90)*2)
    // formatToEightDecimals(120) returns "120"
    expect(screen.getByText("$120")).toBeInTheDocument();
    
    // Profit should be 100 * 2 = 200
    expect(screen.getByText("+$200")).toBeInTheDocument();
  });
});
