import { MouseEvent, useEffect, useState } from "react";
import { scaleLinear, scaleBand, max, schemeTableau10 } from "d3";
import { Tooltip } from "@mui/material";
import {
  CompleteProductiveActivity,
  VisibilityOptionsAgriculture,
} from "../../../utils/types";
import { formatValueWithUnit } from "../../../utils/formatUtils";
import { optionsUnits } from "../Charts/LineChart";

import styles from "./styles.module.scss";
import { usePropertyStore } from "../../../store/usePropertyStore";

interface IntervalData {
  count: number;
  items: CompleteProductiveActivity[];
}

type Intervals = {
  [key: string]: IntervalData;
};

const processData = (
  data: CompleteProductiveActivity[],
  intervalSize: number,
  getValue: (item: CompleteProductiveActivity) => number
) => {
  const intervals: Intervals = {};

  if (data) {
    data.forEach((item) => {
      const distance = getValue(item);
      const intervalStart = Math.floor(distance / intervalSize) * intervalSize;
      const intervalEnd = intervalStart + intervalSize;
      const intervalLabel = `${intervalStart} - ${intervalEnd}`;

      if (intervals[intervalLabel]) {
        intervals[intervalLabel].count++;
        intervals[intervalLabel].items.push(item);
      } else {
        intervals[intervalLabel] = {
          count: 1,
          items: [item],
        };
      }
    });
  }

  const processedData = Object.keys(intervals).map((key) => ({
    interval: key,
    count: intervals[key].count,
    items: intervals[key].items,
  }));

  processedData.sort((a, b) => {
    const aStart = parseInt(a.interval.split("-")[0], 10);
    const bStart = parseInt(b.interval.split("-")[0], 10);
    return aStart - bStart;
  });

  return processedData;
};

export default function BarChartIntervals({
  width,
  height,
  datas,
  selectedChart,
  setSelectedChart,
  chartName,
  getValue,
  VisibilityOptionsAgriculture,
  id = "propriedade_id",
  UM = "",
  label = "Propriedades",
}: {
  width: number;
  height: number;
  datas: CompleteProductiveActivity[];
  chartName: string;
  selectedChart: string;
  setSelectedChart: (chartName: string) => void;
  getValue: (item: CompleteProductiveActivity) => number;
  VisibilityOptionsAgriculture: VisibilityOptionsAgriculture;
  id?: "propriedade_id" | "id";
  UM?: string;
  label?: string;
}) {
  const { propertiesID, updatePropertyID } = usePropertyStore();

  const [selectedIntervals, setSelectedIntervals] = useState<string[]>([]);

  const [data, setDatas] = useState<CompleteProductiveActivity[]>(datas);

  useEffect(() => {
    if (selectedChart !== chartName) {
      setSelectedIntervals([]);
    }
  }, [selectedChart, chartName]);

  useEffect(() => {
    if (selectedIntervals.length === 0) {
      setDatas(datas.filter((property) => propertiesID.includes(property[id])));
    } else {
      setDatas(datas);
    }
  }, [selectedIntervals, datas, selectedChart, propertiesID, id]);

  const margin = { top: 10, right: 20, bottom: 15, left: 120 };

  const maxIntervals = 5;

  const intervalSize = Math.ceil(
    Math.max(...datas.map(getValue)) / maxIntervals
  );

  const processedData = processData(data, intervalSize, getValue);

  const xScale = scaleLinear()
    .domain([0, max(processedData, (d) => d.count) ?? 0])
    .range([margin.left, width - margin.right]);

  const yScale = scaleBand()
    .domain(processedData.map((d) => d.interval))
    .range([margin.top, height - margin.bottom])
    .padding(
      processedData.length === 1 || processedData.length === 2 ? 0.3 : 0.1
    );

  const handleClick = (
    interval: string,
    items: CompleteProductiveActivity[],
    event: MouseEvent<SVGRectElement>
  ) => {
    event.stopPropagation();

    if (selectedChart !== chartName) {
      setSelectedChart(chartName);
    }

    if (selectedIntervals.includes(interval)) {
      const updatedIntervals = selectedIntervals.filter((i) => i !== interval);
      setSelectedIntervals(updatedIntervals);
      const remainingItems = processedData
        .filter((d) => updatedIntervals.includes(d.interval))
        .flatMap((d) => d.items);
      updatePropertyID(
        remainingItems.length
          ? remainingItems.map((property) => property[id])
          : data.map((property) => property[id])
      );
    } else {
      setSelectedIntervals([...selectedIntervals, interval]);

      if (selectedChart !== chartName) {
        setSelectedChart(chartName);
        const [startKm, endKm] = interval.split("-").map(Number);
        const filteredItems = datas.filter((item) => {
          const distanceKm = getValue(item);
          return distanceKm >= startKm && distanceKm < endKm;
        });

        updatePropertyID(filteredItems.map((property) => property[id]));
      } else {
        updatePropertyID(
          [
            ...new Set([
              ...selectedIntervals.flatMap(
                (i) => processedData.find((d) => d.interval === i)?.items || []
              ),
              ...items,
            ]),
          ].map((property) => property[id])
        );
      }
    }
  };

  const handleSvgClick = () => {
    setSelectedIntervals([]);
    updatePropertyID(data.map((property) => property[id]));
  };

  const gridLines = xScale.ticks().map((tick, i) => {
    const interval = Math.ceil(xScale.ticks().length / (width / 19));
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
            className={styles.gridText}
            x={xScale(tick)}
            y={height - margin.bottom + 15}
          >
            {tick}
          </text>
        </g>
      )
    );
  });

  return (
    <svg
      className={styles.barChartContainer}
      width={width}
      height={height}
      onClick={handleSvgClick}
      aria-label={`Gráfico de Barras - ${chartName}`}
    >
      {gridLines}

      {processedData.map((d) => {
        const numbers = d.interval.split(" - ").map(Number);
        return (
          <Tooltip
            key={d.interval}
            title={`${formatValueWithUnit(
              VisibilityOptionsAgriculture,
              numbers[0],
              optionsUnits
            )}
          -
          ${formatValueWithUnit(
            VisibilityOptionsAgriculture,
            numbers[1],
            optionsUnits
          )} ${UM}: ${d.count} ${label}`}
            disableInteractive
          >
            <rect
              className={styles.bar}
              x={xScale(0)}
              y={yScale(d.interval)}
              width={xScale(d.count) - xScale(0)}
              height={yScale.bandwidth()}
              fill={schemeTableau10[3]}
              opacity={
                selectedIntervals.length === 0 ||
                selectedIntervals.includes(d.interval)
                  ? 1
                  : 0.5
              }
              onClick={(event) => handleClick(d.interval, d.items, event)}
            />
          </Tooltip>
        );
      })}

      {processedData.map((d) => {
        const numbers = d.interval.split(" - ").map(Number);

        return (
          <text
            className={styles.barLabel}
            key={d.interval}
            x={xScale(0) - 10}
            y={(yScale(d.interval) ?? 0) + yScale.bandwidth() / 2}
            alignmentBaseline="middle"
          >
            {formatValueWithUnit(
              VisibilityOptionsAgriculture,
              numbers[0],
              optionsUnits
            )}{" "}
            -{" "}
            {formatValueWithUnit(
              VisibilityOptionsAgriculture,
              numbers[1],
              optionsUnits
            )}{" "}
            {UM}
          </text>
        );
      })}
    </svg>
  );
}
