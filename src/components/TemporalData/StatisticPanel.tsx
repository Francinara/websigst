import { formatValueWithUnit } from "../../utils/formatUtils";
import {
  calculateAverage,
  calculateAverageAnnualGrowth,
  calculateStandardDeviation,
} from "../../utils/statisticsUtils";
import { OptionsUnits, VisibilityOptions } from "../../utils/types";

import styles from "./styles.module.scss";

interface StatisticPanelProps {
  selectedCategory: string;
  processedData: {
    [category: string]: number;
    year: number;
  }[];
  selectedButton: VisibilityOptions;
  optionsUnits: OptionsUnits;
}

export default function StatisticPanel({
  selectedCategory,
  processedData,
  selectedButton,
  optionsUnits,
}: StatisticPanelProps) {
  const categoryData = processedData
    .map((d) => ({ year: d.year, value: d[selectedCategory] }))
    .filter((data) => data.value !== 0);

  if (categoryData.length === 0 || selectedCategory === "all") {
    return null;
  }

  const averageValue = calculateAverage(categoryData);
  const stdDev = calculateStandardDeviation(categoryData, averageValue);
  const averageAnnualGrowth = calculateAverageAnnualGrowth(categoryData);
  const startDate = categoryData[0]?.year || null;
  const endDate = categoryData[categoryData.length - 1]?.year || null;

  return (
    <div className={styles.statisticPanelContainer}>
      <div className={styles.container}>
        <div className={styles.metric}>
          <p className={styles.value}>
            {formatValueWithUnit(selectedButton, averageValue, optionsUnits)}
          </p>
          <p className={styles.label}>
            Média <b>{startDate}</b> - <b>{endDate}</b>
          </p>
        </div>

        <div className={styles.metric}>
          <p className={styles.value}>
            {formatValueWithUnit(selectedButton, stdDev, optionsUnits)}
          </p>
          <p className={styles.label}>Desvio Padrão</p>
        </div>

        <div className={styles.metric}>
          <p className={styles.value}>{averageAnnualGrowth.toFixed(2)}%</p>
          <p className={styles.label}>Crescimento Médio Anual</p>
        </div>
      </div>
    </div>
  );
}
