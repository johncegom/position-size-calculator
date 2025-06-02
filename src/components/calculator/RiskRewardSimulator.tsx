import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useTranslation } from "react-i18next";
import { calculateTakeProfitPrice } from "../../utils/calculations";
import { formatToTwoDecimals } from "../../utils/formatters";
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
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-lg font-semibold text-gray-800">
            {scenario.label}
          </h4>
          <span
            className={`px-2 py-1 rounded text-sm font-medium ${
              scenario.ratio >= RATIO_THRESHOLDS.GOOD
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {scenario.ratio >= RATIO_THRESHOLDS.GOOD
              ? t("simulator.good")
              : t("simulator.fair")}
          </span>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">
              {" "}
              {t("simulator.takeProfitPrice")}
            </span>
            <span className="font-medium">
              ${formatToTwoDecimals(scenario.takeProfitPrice)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">
              {t("simulator.potentialProfit")}
            </span>
            <span className="font-medium text-green-600">
              ${formatToTwoDecimals(scenario.potentialProfit)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">
              {t("simulator.profitPercentage")}
            </span>
            <span className="font-medium text-green-600">
              {formatToTwoDecimals(profitPercentage)}%
            </span>
          </div>

          <div className="flex justify-between pt-2 border-t border-gray-300">
            <span className="text-gray-600">{t("simulator.riskAmount")}</span>
            <span className="font-medium text-red-600">
              ${formatToTwoDecimals(scenario.potentialLoss)}
            </span>
          </div>
        </div>

        {/* Visual progress bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{t("simulator.risk")}</span>
            <span>{t("simulator.reward")}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-red-400 to-green-400 rounded-full relative">
              <div
                className="absolute top-0 left-0 h-full bg-red-500 rounded-l-full"
                style={{ width: `${(1 / (1 + scenario.ratio)) * 100}%` }}
              />
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1</span>
            <span>{scenario.ratio}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{t("simulator.title")}</h2>
        <div className="text-sm text-gray-500">
          {t("simulator.positionLabel")} ${formatToTwoDecimals(positionSize)}
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4">{t("simulator.subtitle")}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SCENARIOS.map((scenario) => (
          <ScenarioCard key={scenario.label} scenario={scenario} />
        ))}
      </div>

      <div className="mt-4 bg-blue-50 border border-blue-100 rounded-md p-3 text-xs text-gray-700">
        <p className="font-medium mb-1">{t("simulator.simulationTip")}</p>
        <p>{t("simulator.simulationTipText")}</p>
      </div>
    </div>
  );
};

export default RiskRewardSimulator;
