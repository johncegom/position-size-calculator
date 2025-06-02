import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { formatToTwoDecimals } from "../../utils/formatters";
import { useTranslation } from "react-i18next";

type ResultItemProps = {
  label: string;
  value: number;
};

const ResultItem = ({ label, value }: ResultItemProps) => {
  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
      <p className="text-gray-800">
        <span className="font-medium">{label}:</span>{" "}
        <span className="text-blue-600 font-bold">
          ${formatToTwoDecimals(value)}
        </span>
      </p>
    </div>
  );
};

const ResultDisplay = () => {
  const { calculationResult } = useSelector(
    (state: RootState) => state.calculator
  );
  const { t } = useTranslation();

  if (!calculationResult) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">
          {t("calculator.resultsTitle")}
        </h2>
        <p className="text-gray-500 italic">{t("calculator.noResults")}</p>
      </div>
    );
  }

  const { positionSize, potentialLoss, potentialProfit } = calculationResult;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {t("calculator.resultsTitle")}
      </h2>
      {positionSize > 0 && (
        <ResultItem label={t("calculator.positionSize")} value={positionSize} />
      )}

      {potentialLoss > 0 && (
        <ResultItem
          label={t("calculator.potentialLoss")}
          value={potentialLoss}
        />
      )}

      {potentialProfit > 0 && (
        <ResultItem
          label={t("calculator.potentialProfit")}
          value={potentialProfit}
        />
      )}
    </div>
  );
};

export default ResultDisplay;
