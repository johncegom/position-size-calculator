import { render, screen } from "@testing-library/react";
import RiskRewardVisual from "./RiskRewardVisual";
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

describe("RiskRewardVisual Component", () => {
  const mockTradeParameters = {
    stopLossPrice: 48000,
    entryPrice: 50000,
    takeProfitPrice: 56000,
  };

  it("renders correctly with full data", () => {
    (useSelector as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      calculationResult: {
        potentialLoss: 100,
        potentialProfit: 300,
        riskRewardRatio: 3,
      },
      tradeParameters: mockTradeParameters,
    });

    render(<RiskRewardVisual />);

    // Check ratio display
    expect(screen.getByText("riskReward.ratio")).toBeInTheDocument();
    // 1 : 3.00
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();

    // Check progress bars labels/values
    expect(screen.getByText("riskReward.risk")).toBeInTheDocument();
    expect(screen.getByText("$100")).toBeInTheDocument();

    expect(screen.getByText("riskReward.potentialReward")).toBeInTheDocument();
    expect(screen.getByText("$300")).toBeInTheDocument();

    // Check price levels
    expect(screen.getByText("riskReward.stopLoss")).toBeInTheDocument();
    expect(screen.getByText("$48000")).toBeInTheDocument();
    expect(screen.getByText("riskReward.entryPrice")).toBeInTheDocument();
    expect(screen.getByText("$50000")).toBeInTheDocument();
    expect(screen.getByText("riskReward.takeProfit")).toBeInTheDocument();
    expect(screen.getByText("$56000")).toBeInTheDocument();
  });

  it("renders 'N/A' or placeholders when data is missing", () => {
    (useSelector as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      calculationResult: null,
      tradeParameters: {
        entryPrice: 0,
        stopLossPrice: 0,
        takeProfitPrice: 0,
      },
    });

    render(<RiskRewardVisual />);

    expect(screen.getByText("riskReward.noData")).toBeInTheDocument();
    // Ratio part
    expect(screen.getAllByText("--").length).toBeGreaterThan(0);
    // Price Levels N/A
    const nas = screen.getAllByText("N/A");
    expect(nas.length).toBeGreaterThanOrEqual(1);
  });

  it("handles High Risk scenario (Risk > Reward)", () => {
    (useSelector as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      calculationResult: {
        potentialLoss: 300,
        potentialProfit: 100, // Reward is smaller
        riskRewardRatio: 0.33,
      },
      tradeParameters: mockTradeParameters,
    });

    render(<RiskRewardVisual />);

    // Risk bar should exist and likely be larger or max width logic
    expect(screen.getByText("$300")).toBeInTheDocument();
    expect(screen.getByText("$100")).toBeInTheDocument();

    // Check ratio (Improve Ratio message should appear)
    expect(screen.getByText("riskReward.improveRatio")).toBeInTheDocument();
  });

  it("handles Excellent Ratio scenario", () => {
    (useSelector as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      calculationResult: {
        potentialLoss: 100,
        potentialProfit: 500, // 1:5 ratio
        riskRewardRatio: 5,
      },
      tradeParameters: mockTradeParameters,
    });

    render(<RiskRewardVisual />);

    expect(screen.getByText("riskReward.excellentRatio")).toBeInTheDocument();
  });
});
