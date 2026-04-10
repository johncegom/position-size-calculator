import { render, screen } from "@testing-library/react";
import ResultDisplay from "./ResultDisplay";
import { useSelector } from "react-redux";
import { vi, describe, it, expect } from "vitest";

// Mock dependencies
vi.mock("react-redux", () => ({
  useSelector: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("ResultDisplay Component", () => {
  it("renders empty state when there are no calculation results", () => {
    (useSelector as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      calculationResult: null,
    });

    render(<ResultDisplay />);

    expect(screen.getByText("calculator.resultsTitle")).toBeInTheDocument();
    expect(screen.getByText("calculator.noResults")).toBeInTheDocument();
  });

  it("renders calculation results correctly", () => {
    (useSelector as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      calculationResult: {
        positionSize: 1.5,
        potentialLoss: 50,
        potentialProfit: 150,
        riskRewardRatio: 3,
      },
    });

    render(<ResultDisplay />);

    // Check for position size
    expect(screen.getByText("$1.5")).toBeInTheDocument();
    expect(screen.getByText("calculator.positionSize")).toBeInTheDocument();

    // Check for potential loss
    expect(screen.getByText("$50")).toBeInTheDocument();
    expect(screen.getByText("calculator.potentialLoss")).toBeInTheDocument();

    // Check for potential profit
    expect(screen.getByText("$150")).toBeInTheDocument();
    expect(screen.getByText("calculator.potentialProfit")).toBeInTheDocument();
  });

  it("handles extremely large numbers gracefully", () => {
    (useSelector as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      calculationResult: {
        positionSize: 1000000000,
        potentialLoss: 5000000,
        potentialProfit: 15000000,
        riskRewardRatio: 3,
      },
    });

    render(<ResultDisplay />);

    // Check if it renders strings, exact formatting might depend on utility
    // But mainly we check it doesn't crash
    expect(screen.getByText("$1000000000")).toBeInTheDocument();
  });

  it("handles zero values correctly", () => {
    (useSelector as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      calculationResult: {
        positionSize: 0,
        potentialLoss: 0,
        potentialProfit: 0,
        riskRewardRatio: 0,
      },
    });

    render(<ResultDisplay />);

    // Position size 0
    expect(screen.getByText("$0")).toBeInTheDocument();

    // Profit 0 should show dashes per previous logic
    const dashes = screen.queryAllByText("--");
    expect(dashes.length).toBeGreaterThan(0);
  });

  it("displays correct styling for empty profit", () => {
    (useSelector as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      calculationResult: {
        positionSize: 1.5,
        potentialLoss: 50,
        potentialProfit: 0,
        riskRewardRatio: 0,
      },
    });

    render(<ResultDisplay />);

    expect(screen.getByText("$50")).toBeInTheDocument();
    // Use getAllByText for "--" since it might appear multiple times or matches strictly
    // Based on component code:
    // potentialProfit > 0 ? ( value ) : ( <p>--</p> )
    const dashes = screen.queryAllByText("--");
    expect(dashes.length).toBeGreaterThan(0);
  });
});
