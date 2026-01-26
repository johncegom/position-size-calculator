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

const ScenarioCard = ({
  scenario,
  totalCapital,
}: {
  scenario: SimulationScenario;
  totalCapital: number;
}) => {
  const { t } = useTranslation();
  const profitPercentage = (scenario.potentialProfit / totalCapital) * 100;

  return (
    <div className="p-5 transition-all border shadow-sm border-indigo-100 bg-indigo-50/30 dark:bg-white/5 dark:border-white/10 rounded-xl hover:shadow-md hover:bg-white dark:hover:bg-white/10">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold text-gray-800 dark:text-white font-display">
          {scenario.label}
        </h4>
        <span
          className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
            scenario.ratio >= RATIO_THRESHOLDS.GOOD
              ? "bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300"
              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300"
          }`}
        >
          {scenario.ratio >= RATIO_THRESHOLDS.GOOD
            ? t("simulator.good")
            : t("simulator.fair")}
        </span>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="font-medium text-gray-500 dark:text-gray-400">
            {t("simulator.takeProfitPrice")}
          </span>
          <span className="font-bold text-gray-900 font-mono dark:text-white">
            ${formatToEightDecimals(scenario.takeProfitPrice)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium text-gray-500 dark:text-gray-400">
            {t("simulator.potentialProfit")}
          </span>
          <span className="font-bold text-teal-600 font-mono dark:text-teal-300">
            ${formatToTwoDecimals(scenario.potentialProfit)}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium text-gray-500 dark:text-gray-400">
            {t("simulator.profitPercentage")}
          </span>
          <span className="font-bold text-teal-600 font-mono dark:text-teal-300">
            {formatToTwoDecimals(profitPercentage)}%
          </span>
        </div>

        <div className="flex justify-between pt-3 mt-3 border-t border-gray-200 dark:border-gray-700">
          <span className="font-medium text-gray-500 dark:text-gray-400">
            {t("simulator.riskAmount")}
          </span>
          <span className="font-bold text-red-600 font-mono dark:text-red-300">
            ${formatToTwoDecimals(scenario.potentialLoss)}
          </span>
        </div>
      </div>
    </div>
  );
};

const RiskRewardSimulator = () => {
  const { tradeParameters, calculationResult } = useSelector(
    (state: RootState) => state.calculator,
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
      ratio,
    );
    const potentialProfit = potentialLoss * ratio;
    return {
      ...scenario,
      takeProfitPrice,
      potentialProfit,
    };
  });

  return (
    <div className="p-6 glass-panel rounded-2xl">
      <div className="flex flex-col items-center justify-between mb-6 md:flex-row">
        <div>
          <h2 className="text-xl font-bold text-gray-900 cursor-default dark:text-white font-display">
            {t("simulator.title")}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("simulator.subtitle")}
          </p>
        </div>
        <div className="mt-4 text-right md:mt-0">
          <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
            {t("simulator.positionLabel")}
          </span>
          <div className="text-2xl font-bold text-indigo-600 font-mono dark:text-indigo-400">
            ${formatToTwoDecimals(positionSize)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {SCENARIOS.map((scenario) => (
          <ScenarioCard
            key={scenario.label}
            scenario={scenario}
            totalCapital={totalCapital}
          />
        ))}
      </div>
    </div>
  );
};

export default RiskRewardSimulator;
