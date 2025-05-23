import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

const ResultDisplay = () => {
  const { calculationResult } = useSelector(
    (state: RootState) => state.calculator
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Calculation Results</h2>
      {calculationResult?.positionSize && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
          <p className="text-gray-800">
            <span className="font-medium">Position Size:</span>{" "}
            <span className="text-blue-600 font-bold">
              {`${calculationResult.positionSize}$`}
            </span>
          </p>
        </div>
      )}
      {calculationResult?.potentialLoss && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
          <p className="text-gray-800">
            <span className="font-medium">Potential Loss:</span>{" "}
            <span className="text-blue-600 font-bold">
              {`${calculationResult.potentialLoss}$`}
            </span>
          </p>
        </div>
      )}
      {(calculationResult?.potentialProfit || null) && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
          <p className="text-gray-800">
            <span className="font-medium">Potential Profit:</span>{" "}
            <span className="text-blue-600 font-bold">
              {calculationResult?.potentialProfit}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;
