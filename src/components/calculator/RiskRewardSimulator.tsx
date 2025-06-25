import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useTranslation } from "react-i18next";
import { calculateTakeProfitPrice } from "../../utils/calculations";
import {
  formatToEightDecimals,
  formatToTwoDecimals,
} from "../../utils/formatters";
import { RATIO_THRESHOLDS } from "../../constants/ratioThresholds";

interface SimulationScenario {
  ratio: number;
  label: string;
  takeProfitPrice: number;
  potentialProfit: number;
  potentialLoss: number;
}

const RiskRewardSimulator = () => {
  const { tradeParameters, calculationResult } = useSelector(
    (state: RootState) => state.calculator
  );
  const { t } = useTranslation();

  const { entryPrice, stopLossPrice, totalCapital } = tradeParameters;
  const positionSize = calculationResult?.positionSize || 0;
  const potentialLoss = calculationResult?.potentialLoss || 0;

  if (!entryPrice || !stopLossPrice || !positionSize) {
    return null;
  }

  const SCENARIOS: SimulationScenario[] = [
    {
      ratio: 1,
      label: "1:1",
      takeProfitPrice: 0,
      potentialProfit: 0,
      potentialLoss,
    },
    {
      ratio: 2,
      label: "1:2",
      takeProfitPrice: 0,
      potentialProfit: 0,
      potentialLoss,
    },
    {
      ratio: 3,
      label: "1:3",
      takeProfitPrice: 0,
      potentialProfit: 0,
      potentialLoss,
    },
  ].map((scenario) => {
    const { ratio } = scenario;
    const takeProfitPrice = calculateTakeProfitPrice(
      entryPrice,
      stopLossPrice,
      ratio
    );
    const potentialProfit = potentialLoss * ratio;
    return {
      ...scenario,
      takeProfitPrice,
      potentialProfit,
    };
  });

  type ScenarioCardProps = {
    scenario: SimulationScenario;
  };

  const ScenarioCard = ({ scenario }: ScenarioCardProps) => {
    const profitPercentage = (scenario.potentialProfit / totalCapital) * 100;

    return (
      <div className="p-4 border border-gray-200 rounded-lg dark:border-gray-400 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-50">
            {scenario.label}
          </h4>
          <span
            className={`px-2 py-1 rounded text-sm font-medium cursor-default ${
              scenario.ratio >= RATIO_THRESHOLDS.GOOD
                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                : "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
            }`}
          >
            {scenario.ratio >= RATIO_THRESHOLDS.GOOD
              ? t("simulator.good")
              : t("simulator.fair")}
          </span>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-200">
              {t("simulator.takeProfitPrice")}
            </span>
            <span className="font-medium dark:text-gray-200">
              ${formatToEightDecimals(scenario.takeProfitPrice)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-200">
              {t("simulator.potentialProfit")}
            </span>
            <span className="font-medium text-green-600 dark:text-green-400">
              ${formatToTwoDecimals(scenario.potentialProfit)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-200">
              {t("simulator.profitPercentage")}
            </span>
            <span className="font-medium text-green-600 dark:text-green-400">
              {formatToTwoDecimals(profitPercentage)}%
            </span>
          </div>

          <div className="flex justify-between pt-2 border-t border-gray-300 dark:border-gray-400">
            <span className="text-gray-600 dark:text-gray-200">
              {t("simulator.riskAmount")}
            </span>
            <span className="font-medium text-red-600 dark:text-red-400">
              ${formatToTwoDecimals(scenario.potentialLoss)}
            </span>
          </div>
        </div>

        {/* Visual progress bar */}
        <div className="mt-3">
          <div className="flex justify-between mb-1 text-xs text-gray-500 dark:text-gray-200">
            <span className="cursor-default">{t("simulator.risk")}</span>
            <span className="cursor-default">{t("simulator.reward")}</span>
          </div>
          <div className="h-2 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-800">
            <div className="relative h-full rounded-full bg-gradient-to-r from-red-400 to-green-400 dark:from-red-700 dark:to-green-700">
              <div
                className="absolute top-0 left-0 h-full bg-red-500 rounded-l-full dark:bg-red-700"
                style={{ width: `${(1 / (1 + scenario.ratio)) * 100}%` }}
              />
            </div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-200">
            <span className="cursor-default">1</span>
            <span className="cursor-default">{scenario.ratio}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:shadow-[0_2px_16px_0_rgba(255,255,255,0.08)]">
      <div className="flex flex-col items-center justify-between mb-4 md:flex-row">
        <h2 className="text-xl font-semibold text-gray-900 cursor-default dark:text-gray-50">
          {t("simulator.title")}
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-200">
          <span className="cursor-default">{t("simulator.positionLabel")}</span>{" "}
          <span>${formatToTwoDecimals(positionSize)}</span>
        </div>
      </div>

      <p className="mb-4 text-sm text-gray-600 dark:text-gray-200">
        {t("simulator.subtitle")}
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {SCENARIOS.map((scenario) => (
          <ScenarioCard key={scenario.label} scenario={scenario} />
        ))}
      </div>

      <div className="p-3 mt-4 text-xs text-gray-700 border border-blue-100 rounded-md dark:text-gray-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950">
        <p className="mb-1 font-medium cursor-default">
          {t("simulator.simulationTip")}
        </p>
        <p>{t("simulator.simulationTipText")}</p>
      </div>
    </div>
  );
};

export default RiskRewardSimulator;
