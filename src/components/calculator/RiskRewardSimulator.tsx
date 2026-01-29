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

const ScenarioRow = ({
  scenario,
  totalCapital,
}: {
  scenario: SimulationScenario;
  totalCapital: number;
}) => {
  const { t } = useTranslation();
  const profitPercentage = (scenario.potentialProfit / totalCapital) * 100;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 transition-all border shadow-sm border-indigo-50/50 bg-white/50 dark:bg-white/5 dark:border-white/5 rounded-xl hover:bg-white hover:shadow-md dark:hover:bg-white/10 group">
      {/* Ratio & Status */}
      <div className="flex items-center gap-4 mb-3 sm:mb-0 w-full sm:w-1/3">
        <div className="flex flex-col">
          <span className="text-xl font-bold font-display text-gray-900 dark:text-white">
            {scenario.label}
          </span>
          <span
            className={`text-[10px] font-bold uppercase tracking-wider ${
              scenario.ratio >= RATIO_THRESHOLDS.GOOD
                ? "text-teal-600 dark:text-teal-400"
                : "text-amber-600 dark:text-amber-400"
            }`}
          >
            {scenario.ratio >= RATIO_THRESHOLDS.GOOD
              ? t("simulator.good")
              : t("simulator.fair")}
          </span>
        </div>
      </div>

      {/* Metrics Grid within Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-12 gap-y-2 w-full sm:w-2/3">
        {/* Target Price */}
        <div className="flex flex-col sm:items-end">
          <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">
            {t("simulator.takeProfitPrice")}
          </span>
          <span className="font-mono text-sm font-bold text-gray-700 dark:text-gray-200">
            ${formatToEightDecimals(scenario.takeProfitPrice)}
          </span>
        </div>

        {/* Potential Gain */}
        <div className="flex flex-col sm:items-end">
          <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">
            {t("simulator.potentialProfit")}
          </span>
          <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
            +${formatToTwoDecimals(scenario.potentialProfit)}
          </span>
        </div>

        {/* ROI % */}
        <div className="flex flex-col sm:items-end">
          <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">
            ROI
          </span>
          <span className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
            {formatToTwoDecimals(profitPercentage)}%
          </span>
        </div>

        {/* Risk (Constant) - Maybe less important to show repeated? 
            Actually let's show R-Multiple or Net Profit instead? 
            Let's keep it simple: Net Result */}
        <div className="flex flex-col sm:items-end">
          <span className="text-[10px] uppercase text-gray-400 font-semibold tracking-wider">
            Net
          </span>
          <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">
            ${formatToTwoDecimals(scenario.potentialProfit)}
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
    <div className="p-8 glass-panel rounded-2xl h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 cursor-default dark:text-white font-display">
            {t("simulator.title")}
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-sm">
            {t("simulator.subtitle")}
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-5">
        {SCENARIOS.map((scenario) => (
          <ScenarioRow
            key={scenario.label}
            scenario={scenario}
            totalCapital={totalCapital}
          />
        ))}
      </div>

      <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
        <span className="text-xs text-gray-400 font-medium">
          {t("simulator.calculatedBasedOn")}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">
            Risk:
          </span>
          <span className="font-mono text-sm font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-md">
            ${formatToTwoDecimals(potentialLoss)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RiskRewardSimulator;
