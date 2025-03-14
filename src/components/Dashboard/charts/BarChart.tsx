import { RefObject, useEffect, useMemo, useState } from "react";
import { scaleLinear, scaleBand, max, scaleOrdinal, schemeTableau10 } from "d3";
import { Tooltip } from "@mui/material";
import {
  CompleteProductiveActivity,
  VisibilityOptionsAgriculture,
} from "../../../utils/types";
import { formatValueWithUnit } from "../../../utils/formatUtils";

import styles from "./styles.module.scss";
import { usePropertyStore } from "../../../store/usePropertyStore";
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

  activityData.sort((a, b) => a.otherActivity.localeCompare(b.otherActivity));

  return activityData;
};

export default function BarChart({
  chartRef,
  height,
  marginLeft,
  datas,
  selectedChart,
  chartName,
  field,
  countLogic = (items) => items.length,
  VisibilityOptionsAgriculture,
  id = "propriedade_id",
  label = "Propriedade",
}: {
  chartRef: RefObject<HTMLDivElement>;
  height: number;
  marginLeft: number;
  datas: CompleteProductiveActivity[];
  selectedChart: string;
  chartName: string;
  field: keyof CompleteProductiveActivity;
  countLogic?: (items: CompleteProductiveActivity[]) => number;
  VisibilityOptionsAgriculture: VisibilityOptionsAgriculture;
  id?: "propriedade_id" | "id";
  label?: string;
}) {
  const { propertiesID, updatePropertyID } = usePropertyStore();

  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const width = useChartWidth(chartRef) / 2 - 36;

  const [data, setDatas] = useState<CompleteProductiveActivity[]>(datas);
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

  const margin = { top: 0, right: 10, bottom: 10, left: marginLeft };

  const processedData = processDataByActivity(data, field, countLogic);

  const xScale = scaleBand()
    .domain(processedData.map((d) => d.otherActivity))
    .range([margin.left, width - margin.right])
    .padding(
      processedData.length === 1 || processedData.length === 2 ? 0.5 : 0.1
    );

  const yScale = scaleLinear()
    .domain([0, max(processedData, (d) => d.count) ?? 0])
    .range([height - margin.bottom, margin.top]);

  const colorScale = useMemo(() => scaleOrdinal(schemeTableau10), []);

  const gridLines = yScale.ticks().map((tick, i) => {
    const interval = Math.ceil(processedData.length / (height / 35));
    if (i % interval !== 0) return null;
    return (
      Number.isInteger(tick) && (
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
            x={margin.left - 10}
            y={yScale(tick)}
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
              <rect
                className={styles.bar}
                x={xScale(d.otherActivity)}
                y={yScale(d.count)}
                width={Math.max(0, xScale.bandwidth())}
                height={yScale(0) - yScale(d.count)}
                fill={colorScale(d.otherActivity)}
              />
            </Tooltip>
          ))}
        </svg>
      )}
    </>
  );
}
