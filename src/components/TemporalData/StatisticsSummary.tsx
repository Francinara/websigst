import { formatValueWithUnit } from "../../utils/formatUtils";
import {
  calculateAverage,
  calculateCoefficientOfVariation,
  calculateMaxValue,
  calculateMedian,
  calculateMinValue,
  calculatePercentile,
  calculateStandardDeviation,
} from "../../utils/statisticsUtils";
import { OptionsUnits, VisibilityOptions } from "../../utils/types";

import styles from "./styles.module.scss";

interface StatisticsSummaryProps {
  selectedCategory: string;
  processedData: {
    [category: string]: number;
    year: number;
  }[];
  selectedButton: VisibilityOptions;
  optionsUnits: OptionsUnits;
}

export default function StatisticsSummary({
  selectedCategory,
  processedData,
  selectedButton,
  optionsUnits,
}: StatisticsSummaryProps) {
  const categoryData = processedData
    .map((d) => ({
      year: d.year,
      value: d[selectedCategory],
    }))
    .filter((data) => data.value !== 0);

  if (categoryData.length === 0 || selectedCategory === "all") {
    return null;
  }

  const maxValueData = calculateMaxValue(categoryData);
  const minValueData = calculateMinValue(categoryData);
  const averageValue = calculateAverage(categoryData);
  const stdDev = calculateStandardDeviation(categoryData, averageValue);
  const medianValue = calculateMedian(categoryData);
  const totalValue = categoryData.reduce((sum, data) => sum + data.value, 0);
  const coefficientOfVariation = calculateCoefficientOfVariation(
    stdDev,
    averageValue
  );
  const percentile25 = calculatePercentile(categoryData, 0.25);
  const percentile75 = calculatePercentile(categoryData, 0.75);

  return (
    <div className={styles.StatisticsSummary}>
      <h3 className={styles.title}>Outras Estatísticas</h3>
      <ul className={styles.list}>
        <li>
          <b>Maior Valor: </b>{" "}
          {formatValueWithUnit(
            selectedButton,
            maxValueData.value,
            optionsUnits
          )}{" "}
          em {maxValueData.year}
        </li>
        <li>
          <b>Menor Valor: </b>
          {formatValueWithUnit(
            selectedButton,
            minValueData.value,
            optionsUnits
          )}{" "}
          em {minValueData.year}
        </li>
        <li>
          <b>Mediana: </b>
          {formatValueWithUnit(selectedButton, medianValue, optionsUnits)}
        </li>
        <li>
          <b>Valor total acumulado: </b>
          {formatValueWithUnit(selectedButton, totalValue, optionsUnits)}
        </li>
        <li>
          <b>Coeficiente de Variação: </b>
          {coefficientOfVariation.toFixed(2)}%
        </li>{" "}
        <li>
          <b>Percentil 25% e 75%: </b>
          {formatValueWithUnit(
            selectedButton,
            percentile25,
            optionsUnits
          )} e {formatValueWithUnit(selectedButton, percentile75, optionsUnits)}
        </li>
      </ul>
    </div>
  );
}
