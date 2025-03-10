import { MouseEvent, useEffect, useMemo, useState } from "react";
import { scaleLinear, scaleBand, max, schemeTableau10 } from "d3";
import { Tooltip } from "@mui/material";
import { PropertyProps } from "../../../contexts/MapContext/types";
import { CaretCircleDown, CaretCircleUp } from "@phosphor-icons/react";
import { formatValueWithUnit } from "../../../utils/formatUtils";
import {
  ProductiveActivities,
  VisibilityOptionsAgriculture,
} from "../../../utils/types";
import { optionsUnits } from "../Charts/LineChart";

import styles from "./styles.module.scss";
import { usePropertyStore } from "../../../store/usePropertyStore";

const ITEMS_PER_PAGE = 10;

interface ActivityData {
  activity: string;
  count: number;
  items: ProductiveActivities[];
}

const processDataByActivity = (
  data: ProductiveActivities[],
  properties: PropertyProps[],
  countKey: string
) => {
  const activityData: ActivityData[] = [];

  data.forEach((activity) => {
    const property = properties.find(
      (property) => property.id === activity.propriedade_id
    );
    if (property?.nome_propriedade) {
      activityData.push({
        activity: property.nome_propriedade,
        count: activity[
          countKey as keyof ProductiveActivities
        ] as unknown as number,
        items: [activity],
      });
    }
  });

  return activityData.sort((a, b) => b.count - a.count);
};

export default function BarChartRankingTest({
  width,
  height,
  datas,
  properties,
  selectedChart,
  setSelectedChart,
  countKey,
  label = "Propriedade",
}: {
  width: number;
  height: number;
  datas: ProductiveActivities[];
  properties: PropertyProps[];
  selectedChart: string;
  setSelectedChart: (chartName: string) => void;
  countKey: string;
  label?: string;
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  const [data, setDatas] = useState<ProductiveActivities[]>(datas);

  const { propertiesID, updatePropertyID } = usePropertyStore();

  useEffect(() => {
    if (selectedChart !== "BarChartRanking") {
      setSelectedActivities([]);
    }
  }, [selectedChart]);

  useEffect(() => {
    if (selectedChart !== "BarChartRanking") {
      setCurrentPage(0);
    }
  }, [selectedChart, data]);

  const filteredData = useMemo(() => {
    if (selectedActivities.length === 0 && selectedChart !== "select") {
      return datas.filter((property) =>
        propertiesID.includes(property.propriedade_id)
      );
    }
    return datas;
  }, [datas, selectedActivities, selectedChart, propertiesID]);

  useEffect(() => {
    setDatas(filteredData);
    if (selectedChart === "select" && selectedActivities.length === 0) {
      updatePropertyID(datas.map((property) => property.propriedade_id));
    }
  }, [filteredData, selectedChart, selectedActivities]);

  const margin = { top: 10, right: 20, bottom: 15, left: 120 };

  const processedData = processDataByActivity(data, properties, countKey);

  const paginatedData = useMemo(() => {
    const start = currentPage * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return processedData.slice(start, end);
  }, [processedData, currentPage]);

  const xScale = scaleLinear()
    .domain([0, max(processedData, (d) => d.count) ?? 0])
    .range([margin.left, width - margin.right]);

  const yScale = scaleBand()
    .domain(paginatedData.map((d) => d.activity))
    .range([margin.top, height - margin.bottom])
    .padding(
      processedData.length === 1 || processedData.length === 2 ? 0.3 : 0.1
    );

  const handleNextPage = () => {
    if ((currentPage + 1) * ITEMS_PER_PAGE < processedData.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleClick = (
    activity: string,
    items: ProductiveActivities[],
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
        updatedActivities.some(
          (activity) =>
            properties.find((property) => item.propriedade_id === property.id)
              ?.nome_propriedade === activity
        )
      );
      updatePropertyID(
        remainingItems.length
          ? remainingItems.map((property) => property.propriedade_id)
          : data.map((property) => property.propriedade_id)
      );
    } else {
      setSelectedActivities([...selectedActivities, activity]);

      if (selectedChart !== "BarChartRanking") {
        setSelectedChart("BarChartRanking");
        const filteredItems = datas.filter(
          (item) =>
            properties.find((property) => item.propriedade_id === property.id)
              ?.nome_propriedade === activity
        );

        updatePropertyID(
          filteredItems.map((property) => property.propriedade_id)
        );
      } else {
        updatePropertyID([
          ...new Set(
            [
              ...selectedActivities.flatMap(
                (a) => processedData.find((d) => d.activity === a)?.items || []
              ),
              ...items,
            ].map((property) => property.propriedade_id)
          ),
        ]);
      }
    }
  };

  const handleSvgClick = () => {
    setSelectedActivities([]);
    updatePropertyID(data.map((property) => property.propriedade_id));
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  return (
    <div className={styles.barChartRankingContainer}>
      <svg
        width={width}
        height={height}
        onClick={handleSvgClick}
        aria-label="Gráfico de Barras"
      >
        {paginatedData.map((d, i) => (
          <text
            className={styles.barLabel}
            key={i}
            x={xScale(0) - 10}
            y={(yScale(d.activity) ?? 0) + yScale.bandwidth() / 2}
            alignmentBaseline="middle"
          >
            {truncateText(d.activity, 20)}
          </text>
        ))}

        {xScale.ticks().map((tick, i) => {
          const interval = Math.ceil(xScale.ticks().length / (width / 40));
          if (i % interval !== 0) return null;
          return (
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
                {formatValueWithUnit(
                  VisibilityOptionsAgriculture.Production,
                  tick,
                  optionsUnits
                )}
              </text>
            </g>
          );
        })}

        {paginatedData.map((d, i) => (
          <Tooltip
            key={i}
            title={`${d.activity}: ${d.count} ${label}`}
            disableInteractive
          >
            <rect
              className={styles.bar}
              x={xScale(0)}
              y={yScale(d.activity)}
              width={xScale(d.count) - xScale(0)}
              height={yScale.bandwidth()}
              fill={schemeTableau10[4]}
              opacity={
                selectedActivities.length === 0 ||
                selectedActivities.includes(d.activity)
                  ? 1
                  : 0.5
              }
              onClick={(event) => handleClick(d.activity, d.items, event)}
            />
          </Tooltip>
        ))}
      </svg>

      <div className={styles.paginationControls}>
        <button onClick={handlePreviousPage} disabled={currentPage === 0}>
          <CaretCircleUp size={20} weight="fill" />
        </button>
        <button
          onClick={handleNextPage}
          disabled={(currentPage + 1) * ITEMS_PER_PAGE >= processedData.length}
        >
          <CaretCircleDown size={20} weight="fill" />
        </button>
      </div>
    </div>
  );
}
