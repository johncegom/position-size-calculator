// Consider:
// - What data points are needed to visualize risk/reward ratio?
// - Would a chart library be useful here?
// - How can we visually represent the relationship between risk and potential reward?

import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

const RiskRewardVisual = () => {
  const { calculationResult } = useSelector(
    (state: RootState) => state.calculator
  );
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Risk/Reward Analysis</h2>
      {calculationResult?.riskRewardRatio && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
          <p className="text-gray-800">
            <span className="font-medium">Risk/Reward Ratio:</span>{" "}
            <span className="text-blue-600 font-bold">
              {`${calculationResult.riskRewardRatio}$`}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default RiskRewardVisual;
