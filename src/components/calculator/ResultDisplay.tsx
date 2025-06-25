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
    <div className="p-4 mt-4 border border-gray-200 rounded-md dark:border-gray-400 bg-gray-50 dark:bg-gray-800">
      <p className="text-gray-800 dark:text-gray-50">
        <span className="font-medium cursor-default">{label}: </span>{" "}
        <span className="font-bold text-blue-600 dark:text-blue-400">
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
      <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:shadow-[0_2px_16px_0_rgba(255,255,255,0.08)]">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-50">
          {t("calculator.resultsTitle")}
        </h2>
        <p className="italic text-gray-500 dark:text-gray-200">
          {t("calculator.noResults")}
        </p>
      </div>
    );
  }

  const { positionSize, potentialLoss, potentialProfit } = calculationResult;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:shadow-[0_2px_16px_0_rgba(255,255,255,0.08)]">
      <h2 className="mb-4 text-xl font-semibold text-gray-900 cursor-default dark:text-gray-50">
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
