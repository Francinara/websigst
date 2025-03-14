import { RefObject, useEffect, useMemo, useState } from "react";
import { scaleLinear, scaleBand, max } from "d3";
import { Tooltip } from "@mui/material";
import {
  CompleteProductiveActivity,
  VisibilityOptionsAgriculture,
} from "../../../utils/types";
import { formatValueWithUnit } from "../../../utils/formatUtils";
import styles from "./styles.module.scss";
import { usePropertyStore } from "../../../store/usePropertyStore";
import { truncateText } from "../../../utils/truncateTextUtils";
import { useChartWidth } from "../../../hooks/useChartWidth";
import { optionsUnits } from "../../MapContent/Charts/LineChart";
import { ChartBar } from "@phosphor-icons/react";

interface ActivityData {
  otherActivity: string;
  count: number;
  items: CompleteProductiveActivity[];
}

const processDataByActivity = (
  data: CompleteProductiveActivity[],
  field: keyof CompleteProductiveActivity,
  countLogic: (items: CompleteProductiveActivity[]) => number = (items) =>
    items.length
) => {
  const activityData: ActivityData[] = [];

  const activityTypes = [...new Set(data.map((item) => item[field] as string))];

  activityTypes.forEach((otherActivity) => {
    const items = data.filter((item) => item[field] === otherActivity);
    if (items.length > 0) {
      activityData.push({
        otherActivity,
        count: countLogic(items),
        items,
      });
    }
  });

  activityData.sort((a, b) => b.count - a.count);

  return activityData.slice(0, 7);
};

export default function HorizontalBarChart({
  chartRef,
  height,
  datas,
  selectedChart,
  chartName,
  field,
  countLogic = (items) => items.length,
  VisibilityOptionsAgriculture,
  id = "propriedade_id",
  label = "Propriedade",
  color,
}: {
  chartRef: RefObject<HTMLDivElement>;
  height: number;
  datas: CompleteProductiveActivity[];
  selectedChart: string;
  chartName: string;
  field: keyof CompleteProductiveActivity;
  countLogic?: (items: CompleteProductiveActivity[]) => number;
  VisibilityOptionsAgriculture: VisibilityOptionsAgriculture;
  id?: "propriedade_id" | "id";
  label?: string;
  color: string;
}) {
  const { propertiesID, updatePropertyID } = usePropertyStore();
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [data, setDatas] = useState<CompleteProductiveActivity[]>(datas);

  const width = useChartWidth(chartRef) / 2 - 36;

  useEffect(() => {
    if (selectedChart !== chartName) {
      setSelectedActivities([]);
    }
  }, [selectedChart, chartName]);

  const filteredData = useMemo(() => {
    if (selectedActivities.length === 0 && selectedChart !== "select") {
      return datas.filter((property) => propertiesID.includes(property[id]));
    }
    return datas;
  }, [datas, selectedActivities, selectedChart, propertiesID, id]);

  useEffect(() => {
    setDatas(filteredData);
    if (selectedChart === "select" && selectedActivities.length === 0) {
      updatePropertyID(datas.map((property) => property[id]));
    }
  }, [filteredData, selectedChart, selectedActivities, id]);

  const margin = { top: 0, right: 4, bottom: 20, left: 48 };

  const processedData = processDataByActivity(data, field, countLogic);

  const yScale = scaleBand()
    .domain(processedData.map((d) => d.otherActivity))
    .range([margin.top, height - margin.bottom])
    .padding(0.1);

  const xScale = scaleLinear()
    .domain([0, max(processedData, (d) => d.count) ?? 0])
    .range([margin.left, width - margin.right]);

  const gridLines = xScale.ticks().map((tick, i) => {
    const interval = Math.ceil(processedData.length / (width / 35));
    if (i % interval !== 0) return null;
    return (
      Number.isInteger(tick) && (
        <g key={tick}>
          <line
            className={styles.gridLine}
            x1={xScale(tick)}
            x2={xScale(tick)}
            y1={margin.top}
            y2={height - margin.bottom}
          />
          <text
            className={styles.barLabel}
            x={xScale(tick) + 2}
            y={height - margin.bottom + 15}
            textAnchor="middle"
          >
            {formatValueWithUnit(
              VisibilityOptionsAgriculture,
              tick,
              optionsUnits
            )}
          </text>
        </g>
      )
    );
  });

  return (
    <>
      {data.length < 1 ? (
        <ChartBar size={50} weight="duotone" className={styles.icon} />
      ) : (
        <svg
          className={styles.barChartContainer}
          width={Math.max(0, width)}
          height={height}
          aria-label={`Gráfico de Barras ${chartName}`}
        >
          {gridLines}

          {processedData.map((d) => (
            <Tooltip
              key={d.otherActivity}
              title={`${d.otherActivity}: ${formatValueWithUnit(
                VisibilityOptionsAgriculture,
                d.count,
                optionsUnits
              )} ${label}`}
              disableInteractive
            >
              <g>
                <text
                  className={styles.barLabel}
                  x={margin.left - 10}
                  y={yScale(d.otherActivity)! + yScale.bandwidth() / 2}
                  textAnchor="end"
                  alignmentBaseline="middle"
                >
                  {truncateText(d.otherActivity, 6)}
                </text>
                <rect
                  className={styles.bar}
                  x={margin.left}
                  y={yScale(d.otherActivity)}
                  width={Math.max(0, xScale(d.count) - margin.left)}
                  height={yScale.bandwidth()}
                  fill={color}
                />
              </g>
            </Tooltip>
          ))}
        </svg>
      )}
    </>
  );
}
