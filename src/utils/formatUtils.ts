export const formatNumber = (value: number, decimals: number = 2) => {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

export function formatValue(value: number): string {
  if (value == null) {
    return "N/A";
  }

  if (value >= 1e9) {
    return (value / 1e9).toFixed(1) + "B";
  } else if (value >= 1e6) {
    return (value / 1e6).toFixed(1) + "M";
  } else if (value >= 1e3) {
    return (value / 1e3).toFixed(1) + "k";
  }

  return value.toString().includes(".")
    ? value.toFixed(1).toString()
    : value.toString();
}

export function formatValueWithUnit(
  option: string,
  value: number,
  optionsUnits: Record<string, string>
): string {
  const unit = optionsUnits[option];
  return unit === "R$"
    ? `${unit} ${formatValue(value)}`
    : `${formatValue(value)} ${unit}`;
}
