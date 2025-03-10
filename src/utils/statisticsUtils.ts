export function calculateAverageAnnualGrowth(
  data: {
    year: number;
    value: number;
  }[]
) {
  const growthRates = data
    .slice(1)
    .map((item, i) => (item.value - data[i].value) / data[i].value);
  return (
    (growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length) *
    100
  );
}

export function calculateMaxValue(data: { year: number; value: number }[]) {
  return data.reduce(
    (prev, current) => (prev.value > current.value ? prev : current),
    { value: 0, year: -1 }
  );
}

export function calculateMinValue(data: { year: number; value: number }[]) {
  return data.reduce(
    (prev, current) => (prev.value < current.value ? prev : current),
    { value: Infinity, year: -1 }
  );
}

export function calculateAverage(data: { year: number; value: number }[]) {
  return data.reduce((sum, item) => sum + item.value, 0) / data.length;
}

export function calculateStandardDeviation(
  data: { year: number; value: number }[],
  average: number
) {
  const variance =
    data.reduce((sum, item) => sum + Math.pow(item.value - average, 2), 0) /
    data.length;
  return Math.sqrt(variance);
}

export function calculateMedian(data: { year: number; value: number }[]) {
  const sortedValues = data.map((d) => d.value).sort((a, b) => a - b);
  const middleIndex = Math.floor(sortedValues.length / 2);
  return sortedValues.length % 2 === 0
    ? (sortedValues[middleIndex - 1] + sortedValues[middleIndex]) / 2
    : sortedValues[middleIndex];
}

export function calculatePercentile(
  data: { year: number; value: number }[],
  percentile: number
) {
  const sortedValues = data.map((d) => d.value).sort((a, b) => a - b);
  const index = (sortedValues.length - 1) * percentile;
  const lower = Math.floor(index);
  const upper = lower + 1;
  const weight = index % 1;
  return upper < sortedValues.length
    ? sortedValues[lower] * (1 - weight) + sortedValues[upper] * weight
    : sortedValues[lower];
}

export function calculateCoefficientOfVariation(
  stdDev: number,
  average: number
) {
  return average !== 0 ? (stdDev / average) * 100 : 0;
}
