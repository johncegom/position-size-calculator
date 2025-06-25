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
    <div className="p-4 mt-4 border border-gray-200 rounded-md bg-gray-50">
      <p className="text-gray-800">
        <span className="font-medium cursor-default">{label}: </span>{" "}
        <span className="font-bold text-blue-600">
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
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-xl font-semibold">
          {t("calculator.resultsTitle")}
        </h2>
        <p className="italic text-gray-500">{t("calculator.noResults")}</p>
      </div>
    );
  }

  const { positionSize, potentialLoss, potentialProfit } = calculationResult;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-semibold cursor-default">
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
