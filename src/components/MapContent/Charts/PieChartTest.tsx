import { pie, arc } from "d3-shape";
import { scaleOrdinal } from "d3-scale";
import { schemeTableau10 } from "d3-scale-chromatic";
import { PieArcDatum } from "d3";
import { MouseEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Tooltip } from "@mui/material";
import { truncateText } from "../../../utils/truncateTextUtils";
import { CompleteProductiveActivity } from "../../../utils/types";

import styles from "./styles.module.scss";
import { usePropertyStore } from "../../../store/usePropertyStore";
import { formatNumber } from "../../../utils/formatUtils";

type ProcessedData = {
  label: string;
  value: number;
};

export default function PieChartTest({
  width,
  height,
  datas,
  selectedChart,
  setSelectedChart,
  chartName,
  districts,
  getValue,
  id = "propriedade_id",
  label = "Propriedade",
}: {
  width: number;
  height: number;
  datas: CompleteProductiveActivity[];
  selectedChart: string;
  setSelectedChart: (chartName: string) => void;
  chartName: string;
  districts: string[];
  getValue: (district: string, item: CompleteProductiveActivity) => number;
  id?: "propriedade_id" | "id";
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
  }, [selectedIntervals, datas, propertiesID, selectedChart, id]);

  const radius = useMemo(() => Math.min(width, height) / 2, [width, height]);
  const colors = useMemo(() => scaleOrdinal(schemeTableau10), []);

  const labelRadius = radius * 1.1;

  const getLabelPosition = (d: PieArcDatum<ProcessedData>) => {
    const centroid = arcGenerator.centroid(d);

    const angle = (d.startAngle + d.endAngle) / 2;
    const x = Math.cos(angle - Math.PI / 2) * labelRadius;
    const y = Math.sin(angle - Math.PI / 2) * labelRadius;

    return { x, y, centroid };
  };

  const processedData = districts.map((district) => ({
    label: district,
    value: data.reduce((acc, item) => {
      return acc + getValue(district, item);
    }, 0),
  }));

  const pieGenerator = pie<ProcessedData>().value((d) => d.value);
  const arcGenerator = arc<PieArcDatum<ProcessedData>>()
    .innerRadius(radius * 0.6)
    .outerRadius(radius);

  const pieData = useMemo(
    () => pieGenerator(processedData),
    [processedData, pieGenerator]
  );

  const totalValue = useMemo(
    () => processedData.reduce((sum, d) => sum + d.value, 0),
    [processedData]
  );

  const handleClick = useCallback(
    (
      district: string,
      event:
        | MouseEvent<SVGGElement, globalThis.MouseEvent>
        | MouseEvent<HTMLLIElement, globalThis.MouseEvent>
    ) => {
      event.stopPropagation();

      if (selectedChart !== chartName) {
        setSelectedChart(chartName);
      }

      if (selectedIntervals.includes(district)) {
        const updatedIntervals = selectedIntervals.filter(
          (i) => i !== district
        );
        setSelectedIntervals(updatedIntervals);

        const remainingItems = datas.filter((item) =>
          updatedIntervals.some((activity) => getValue(activity, item))
        );

        updatePropertyID(
          remainingItems.length
            ? remainingItems.map((property) => property[id])
            : data.map((property) => property[id])
        );
      } else {
        const updatedIntervals = [...selectedIntervals, district];

        setSelectedIntervals(updatedIntervals);
        const filteredItems = datas.filter((property) =>
          updatedIntervals.some((district) => getValue(district, property))
        );
        updatePropertyID(filteredItems.map((property) => property[id]));
      }
    },
    [
      data,
      datas,
      selectedChart,
      selectedIntervals,
      updatePropertyID,
      setSelectedChart,
      chartName,
      getValue,
      id,
    ]
  );

  const handleSvgClick = useCallback(() => {
    setSelectedIntervals([]);
    updatePropertyID(data.map((property) => property[id]));
  }, [data, updatePropertyID, id]);

  const getCharacterLimit = (midAngle: number) => {
    const angleInDegrees = (midAngle * 180) / Math.PI;
    const distanceFromCenter = Math.abs(angleInDegrees - 90);
    if (distanceFromCenter < 30) return 3;
    if (distanceFromCenter < 60) return 5;
    if (distanceFromCenter < 90) return 10;
    if (distanceFromCenter < 120) return 9;
    if (distanceFromCenter < 150) return 5;
    if (distanceFromCenter < 200) return 3;
    if (distanceFromCenter < 210) return 4;
    if (distanceFromCenter < 240) return 5;
    if (distanceFromCenter < 250) return 8;
    if (distanceFromCenter < 260) return 11;
    return 15;
  };

  return (
    <svg
      className={styles.PieChartContainer}
      width={width}
      height={height + 20}
      onClick={handleSvgClick}
    >
      <g transform={`translate(${width / 2}, ${height / 2 + 10})`}>
        {pieData.map((d) => {
          if (d.value === 0) return;

          const percentage = (d.data.value / totalValue) * 100;

          const { x, y, centroid } = getLabelPosition(d);
          const midAngle = (d.startAngle + d.endAngle) / 2;
          const isLeftSide = midAngle > Math.PI;

          const characterLimit = getCharacterLimit(midAngle);

          return (
            <Tooltip
              key={d.data.label}
              title={
                <>
                  <span>{percentage.toFixed(2)}%</span>
                  <br />
                  <span>
                    {d.data.label}: {formatNumber(d.data.value, 0)} {label}
                  </span>
                </>
              }
              followCursor
            >
              <g
                className={styles.PieChartContainer}
                onClick={(event) => handleClick(d.data.label, event)}
                opacity={
                  selectedIntervals.length === 0 ||
                  selectedIntervals.includes(d.data.label)
                    ? 1
                    : 0.5
                }
              >
                {percentage >= 6.6 && (
                  <>
                    <path
                      className={styles.labelLine}
                      d={`M${centroid[0]},${centroid[1]} L${x},${y} L${
                        isLeftSide ? x - 10 : x + 10
                      },${y}`}
                    />

                    <text
                      x={isLeftSide ? x - 14 : x + 14}
                      y={y}
                      textAnchor={isLeftSide ? "end" : "start"}
                      alignmentBaseline="middle"
                    >
                      {truncateText(d.data.label, characterLimit)}
                    </text>
                  </>
                )}
                <path
                  className={styles.slice}
                  d={arcGenerator(d) || undefined}
                  fill={colors(String(d.data.label))}
                />
              </g>
            </Tooltip>
          );
        })}
      </g>
    </svg>
  );
}
