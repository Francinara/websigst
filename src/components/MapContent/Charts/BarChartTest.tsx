import { MouseEvent, useEffect, useMemo, useState } from "react";
import { scaleLinear, scaleBand, max, scaleOrdinal, schemeTableau10 } from "d3";
import { Tooltip } from "@mui/material";
import {
  CompleteProductiveActivity,
  VisibilityOptionsAgriculture,
} from "../../../utils/types";
import { formatValueWithUnit } from "../../../utils/formatUtils";
import { optionsUnits } from "../Charts/LineChart";

import styles from "./styles.module.scss";
import { usePropertyStore } from "../../../store/usePropertyStore";

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

export default function BarChartTest({
  width,
  height,
  marginLeft,
  datas,
  selectedChart,
  setSelectedChart,
  chartName,
  field,
  countLogic = (items) => items.length,
  VisibilityOptionsAgriculture,
  id = "propriedade_id",
  label = "Propriedade",
}: {
  width: number;
  height: number;
  marginLeft: number;
  datas: CompleteProductiveActivity[];
  selectedChart: string;
  setSelectedChart: (chartName: string) => void;
  chartName: string;
  field: keyof CompleteProductiveActivity;
  countLogic?: (items: CompleteProductiveActivity[]) => number;
  VisibilityOptionsAgriculture: VisibilityOptionsAgriculture;
  id?: "propriedade_id" | "id";
  label?: string;
}) {
  const { propertiesID, updatePropertyID } = usePropertyStore();

  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

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

  const margin = { top: 10, right: 20, bottom: 0, left: marginLeft };

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

  const handleClick = (
    activity: string,
    items: CompleteProductiveActivity[],
    event:
      | MouseEvent<SVGGElement, globalThis.MouseEvent>
      | MouseEvent<HTMLLIElement, globalThis.MouseEvent>
  ) => {
    event.stopPropagation();

    if (selectedActivities.includes(activity)) {
      const updatedActivities = selectedActivities.filter(
        (a) => a !== activity
      );
      setSelectedActivities(updatedActivities);
      const remainingItems = datas.filter((item) =>
        updatedActivities.some((activity) => item[field] === activity)
      );
      updatePropertyID(
        remainingItems.length
          ? remainingItems.map((property) => property[id])
          : data.map((property) => property[id])
      );
    } else {
      setSelectedActivities([...selectedActivities, activity]);

      if (selectedChart !== chartName) {
        setSelectedChart(chartName);
        const filteredItems = datas.filter((item) => item[field] === activity);

        updatePropertyID(filteredItems.map((property) => property[id]));
      } else {
        updatePropertyID([
          ...new Set(
            [
              ...selectedActivities.flatMap(
                (a) =>
                  processedData.find((d) => d.otherActivity === a)?.items || []
              ),
              ...items,
            ].map((property) => property[id])
          ),
        ]);
      }
    }
  };

  const handleSvgClick = () => {
    setSelectedActivities([]);
    updatePropertyID(data.map((property) => property[id]));
  };

  const gridLines = yScale.ticks().map(
    (tick) =>
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

  return (
    <svg
      className={styles.barChartContainer}
      width={width}
      height={height}
      onClick={handleSvgClick}
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
            width={xScale.bandwidth()}
            height={yScale(0) - yScale(d.count)}
            fill={colorScale(d.otherActivity)}
            opacity={
              selectedActivities.length === 0 ||
              selectedActivities.includes(d.otherActivity)
                ? 1
                : 0.5
            }
            onClick={(event) => handleClick(d.otherActivity, d.items, event)}
          />
        </Tooltip>
      ))}
    </svg>
  );
}
