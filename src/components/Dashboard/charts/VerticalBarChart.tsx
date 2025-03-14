import { RefObject, useEffect, useMemo, useState } from "react";
import { scaleLinear, scaleBand, max } from "d3";
import { Tooltip } from "@mui/material";
import styles from "./styles.module.scss";
import { ChartBar } from "@phosphor-icons/react";
import { useChartWidth } from "../../../hooks/useChartWidth";
import { WaterResourceProps } from "../../../services/water-resource/waterResourceApi";
import { formatNumber } from "../../../utils/formatUtils";

interface CapacityData {
  type: string;
  value: number;
  uniqueKey: string;
}
const processDataByCapacity = (data: WaterResourceProps[]): CapacityData[] => {
  const capacities: CapacityData[] = [];

  data.forEach((property, index) => {
    if (property.capacidade_cisterna) {
      capacities.push({
        type: "Cisterna",
        value: property.capacidade_cisterna,
        uniqueKey: `Cisterna-${property.propriedade_id}-${index}`, // Chave única
      });
    }
    if (property.capacidade_acude) {
      capacities.push({
        type: "Açude",
        value: property.capacidade_acude,
        uniqueKey: `Açude-${property.propriedade_id}-${index}`,
      });
    }
    if (property.capacidade_barragem) {
      capacities.push({
        type: "Barragem",
        value: property.capacidade_barragem,
        uniqueKey: `Barragem-${property.propriedade_id}-${index}`,
      });
    }
  });

  return capacities;
};
export default function VerticalBarChart({
  chartRef,
  height,
  datas,
  chartName,
  color,
}: {
  chartRef: RefObject<HTMLDivElement>;
  height: number;
  datas: WaterResourceProps[];
  chartName: string;
  color: string;
}) {
  const width = useChartWidth(chartRef) - 36;
  const [data, setData] = useState<WaterResourceProps[]>(datas);

  useEffect(() => {
    setData(datas);
  }, [datas]);

  const margin = { top: 10, right: 10, bottom: 20, left: 30 };

  const processedData = useMemo(() => processDataByCapacity(data), [data]);

  const xScale = scaleBand()
    .domain(processedData.map((d) => d.type))
    .range([margin.left, width - margin.right])
    .padding(0.2);

  const yScale = scaleLinear()
    .domain([0, max(processedData, (d) => d.value) || 0])
    .range([height - margin.bottom, margin.top]);

  const gridLines = yScale.ticks(5).map((tick) => (
    <g key={tick}>
      <line
        className={styles.gridLine}
        x1={margin.left}
        x2={width - margin.right}
        y1={yScale(tick)}
        y2={yScale(tick)}
      />
      <text
        className={styles.barLabel}
        x={margin.left - 5}
        y={yScale(tick) + 3}
        textAnchor="end"
        alignmentBaseline="middle"
      >
        {tick}
      </text>
    </g>
  ));

  return (
    <>
      {processedData.length < 1 ? (
        <ChartBar size={50} weight="duotone" className={styles.icon} />
      ) : (
        <svg
          className={styles.barChartContainer}
          width={Math.max(0, width)}
          height={height}
          aria-label={`Gráfico de Barras Verticais ${chartName}`}
        >
          {gridLines}

          {processedData.map((d) => (
            <Tooltip
              key={d.uniqueKey}
              title={`${d.type}: ${formatNumber(d.value)}L`}
              disableInteractive
            >
              <g>
                <rect
                  className={styles.bar}
                  x={xScale(d.type)}
                  y={yScale(d.value)}
                  width={xScale.bandwidth()}
                  height={height - margin.bottom - yScale(d.value)}
                  fill={color}
                />
                <text
                  className={styles.verticalBarLabel}
                  x={(xScale(d.type) || 0) + xScale.bandwidth() / 2}
                  y={height - margin.bottom + 15}
                  textAnchor="middle"
                >
                  {d.type}
                </text>
              </g>
            </Tooltip>
          ))}
        </svg>
      )}
    </>
  );
}
