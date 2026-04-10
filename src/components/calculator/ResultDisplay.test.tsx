import { renderWithProviders } from "../../test-utils";
import { screen } from "@testing-library/react";
import ResultDisplay from "./ResultDisplay";
import { describe, it, expect } from "vitest";

describe("ResultDisplay Component", () => {
  it("renders empty state when there are no calculation results", () => {
    renderWithProviders(<ResultDisplay />, {
      preloadedState: { calculator: { calculationResult: null } },
    });

    expect(screen.getByText("Trade Analysis Breakdown")).toBeInTheDocument();
    expect(screen.getByText("Configure your trade parameters above to reveal your optimized position sizes.")).toBeInTheDocument();
  });

  it("renders calculation results correctly", () => {
    renderWithProviders(<ResultDisplay />, {
      preloadedState: {
        calculator: {
          calculationResult: {
            positionSize: 1.5,
            potentialLoss: 50,
            potentialProfit: 150,
            riskRewardRatio: 3,
          },
        },
      },
    });

    expect(screen.getByText("$1.50")).toBeInTheDocument();
    expect(screen.getByText("Optimal Position Size")).toBeInTheDocument();

    // Check for potential loss
    expect(screen.getByText("$50")).toBeInTheDocument();
    expect(screen.getByText("Expected Loss (at SL)")).toBeInTheDocument();

    // Check for potential profit
    expect(screen.getByText("$150")).toBeInTheDocument();
    expect(screen.getByText("Projected Profit (at TP)")).toBeInTheDocument();
  });

  it("handles extremely large numbers gracefully", () => {
    renderWithProviders(<ResultDisplay />, {
      preloadedState: {
        calculator: {
          calculationResult: {
            positionSize: 1000000000,
            potentialLoss: 5000000,
            potentialProfit: 15000000,
            riskRewardRatio: 3,
          },
        },
      },
    });

    // Check if it renders strings, exact formatting might depend on utility
    // But mainly we check it doesn't crash
    expect(screen.getByText("$1000000000")).toBeInTheDocument();
  });

  it("handles zero values correctly", () => {
    renderWithProviders(<ResultDisplay />, {
      preloadedState: {
        calculator: {
          calculationResult: {
            positionSize: 0,
            potentialLoss: 0,
            potentialProfit: 0,
            riskRewardRatio: 0,
          },
        },
      },
    });

    // Position size 0
    expect(screen.getByText("$0")).toBeInTheDocument();

    // Profit 0 should show dashes per previous logic
    const dashes = screen.queryAllByText("--");
    expect(dashes.length).toBeGreaterThan(0);
  });

  it("displays correct styling for empty profit", () => {
    renderWithProviders(<ResultDisplay />, {
      preloadedState: {
        calculator: {
          calculationResult: {
            positionSize: 1.5,
            potentialLoss: 50,
            potentialProfit: 0,
            riskRewardRatio: 0,
          },
        },
      },
    });

    expect(screen.getByText("$50")).toBeInTheDocument();
    // Use getAllByText for "--" since it might appear multiple times or matches strictly
    // Based on component code:
    // potentialProfit > 0 ? ( value ) : ( <p>--</p> )
    const dashes = screen.queryAllByText("--");
    expect(dashes.length).toBeGreaterThan(0);
  });
});
