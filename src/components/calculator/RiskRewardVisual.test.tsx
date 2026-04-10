import { renderWithProviders } from "../../test-utils";
import { screen } from "@testing-library/react";
import RiskRewardVisual from "./RiskRewardVisual";
import { describe, it, expect } from "vitest";

describe("RiskRewardVisual Component", () => {
  const mockTradeParameters = {
    stopLossPrice: 48000,
    entryPrice: 50000,
    takeProfitPrice: 56000,
  };

  it("renders correctly with full data", () => {
    renderWithProviders(<RiskRewardVisual />, {
      preloadedState: {
        calculator: {
          calculationResult: {
            potentialLoss: 100,
            potentialProfit: 300,
            riskRewardRatio: 3,
          },
          tradeParameters: mockTradeParameters,
        },
      },
    });

    // Check ratio display
    expect(screen.getByText("Risk/Reward Performance")).toBeInTheDocument();
    // 1 : 3.00
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();

    // Check progress bars labels/values
    expect(screen.getByText("Allocated Risk")).toBeInTheDocument();
    expect(screen.getByText("$100")).toBeInTheDocument();

    expect(screen.getByText("Potential Reward")).toBeInTheDocument();
    expect(screen.getByText("$300")).toBeInTheDocument();

    // Check price levels
    expect(screen.getByText("Stop Loss")).toBeInTheDocument();
    expect(screen.getByText("$48000")).toBeInTheDocument();
    expect(screen.getByText("Entry Point")).toBeInTheDocument();
    expect(screen.getByText("$50000")).toBeInTheDocument();
    expect(screen.getByText("Profit Target")).toBeInTheDocument();
    expect(screen.getByText("$56000")).toBeInTheDocument();
  });

  it("renders 'N/A' or placeholders when data is missing", () => {
    renderWithProviders(<RiskRewardVisual />, {
      preloadedState: {
        calculator: {
          calculationResult: null,
          tradeParameters: {
            entryPrice: 0,
            stopLossPrice: 0,
            takeProfitPrice: 0,
          },
        },
      },
    });

    expect(screen.getByText("Awaiting Parameters")).toBeInTheDocument();
    // Ratio part
    expect(screen.getAllByText("--").length).toBeGreaterThan(0);
    // Price Levels N/A
    const nas = screen.getAllByText("N/A");
    expect(nas.length).toBeGreaterThanOrEqual(1);
  });

  it("handles High Risk scenario (Risk > Reward)", () => {
    renderWithProviders(<RiskRewardVisual />, {
      preloadedState: {
        calculator: {
          calculationResult: {
            potentialLoss: 300,
            potentialProfit: 100, // Reward is smaller
            riskRewardRatio: 0.33,
          },
          tradeParameters: mockTradeParameters,
        },
      },
    });

    // Risk bar should exist and likely be larger or max width logic
    expect(screen.getByText("$300")).toBeInTheDocument();
    expect(screen.getByText("$100")).toBeInTheDocument();

    // Check ratio (Improve Ratio message should appear)
    expect(screen.getByText("Review Strategy")).toBeInTheDocument();
  });

  it("handles Excellent Ratio scenario", () => {
    renderWithProviders(<RiskRewardVisual />, {
      preloadedState: {
        calculator: {
          calculationResult: {
            potentialLoss: 100,
            potentialProfit: 500, // 1:5 ratio
            riskRewardRatio: 5,
          },
          tradeParameters: mockTradeParameters,
        },
      },
    });

    expect(screen.getByText("High Performance")).toBeInTheDocument();
  });

  it("highlights the Expected R/R ratio and price level when expectedRR is set", () => {
    renderWithProviders(<RiskRewardVisual />, {
      preloadedState: {
        calculator: {
          calculationResult: {
            potentialLoss: 100,
            potentialProfit: 300,
            riskRewardRatio: 3,
          },
          tradeParameters: {
            ...mockTradeParameters,
            expectedRR: 2.5,
          },
        },
      },
    });

    // Should indicate the expected ratio in the badge
    // Real string from simulator.expected: "Expected"
    expect(screen.getByText(/Expected: 1:2\.50/)).toBeInTheDocument();

    // Because 2.5 is different than the current ratio of 3, 
    // it should show a PriceLevelCard for "Your Target"
    expect(screen.getByText("Your Target")).toBeInTheDocument();
    
    // For 2.5 ratio on that range, price should be 55000
    expect(screen.getByText("$55000")).toBeInTheDocument();
  });
});
