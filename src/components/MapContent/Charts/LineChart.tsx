import {
  useEffect,
  useState,
  useMemo,
  MouseEvent,
  useCallback,
  RefObject,
} from "react";
import {
  OptionsUnits,
  VisibilityOptionsAgriculture,
} from "../../../utils/types";

import {
  line,
  max,
  scaleBand,
  scaleLinear,
  scaleOrdinal,
  schemeTableau10,
} from "d3";
import { Tooltip } from "@mui/material";
import { formatValueWithUnit } from "../../../utils/formatUtils";
import { CaretCircleLeft, CaretCircleRight } from "@phosphor-icons/react";
import { AgricultureProps } from "../../../contexts/MapContext/types";

import styles from "./styles.module.scss";
import { useChartWidth } from "../../../hooks/useChartWidth";
import { usePropertyStore } from "../../../store/usePropertyStore";

const ITEMS_PER_PAGE = 12;

export const optionsUnits: OptionsUnits = {
  [VisibilityOptionsAgriculture.Property]: "",
  [VisibilityOptionsAgriculture.Production]: "",
  [VisibilityOptionsAgriculture.SaleValue]: "R$",
  [VisibilityOptionsAgriculture.CultivationArea]: "ha",
};

type IntervalsType = Record<string, Record<string, number>>;

type AllowedCategoryTypes = "cultura";

const isValidCategory = (
  item: AgricultureProps,
  key: keyof AgricultureProps
): key is keyof AgricultureProps => {
  return key in item;
};

type ProcessDataType = {
  processedData: Array<{ yearMonth: string } & { [category: string]: number }>;
  categories: string[];
};

const processData = (
  data: AgricultureProps[],
  startYear: number,
  endYear: number,
  categoryType: AllowedCategoryTypes
): { plantingData: ProcessDataType; harvestData: ProcessDataType } => {
  const createInterval = (key: "data_plantio" | "data_colheita") =>
    data.reduce((acc, item) => {
      const date = new Date(item[key]);
      const yearMonth = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      const category = isValidCategory(item, categoryType)
        ? (item[categoryType] as string)
        : "";
      const value = item.producao_ano;

      acc[yearMonth] = acc[yearMonth] || {};
      acc[yearMonth][category] = (acc[yearMonth][category] || 0) + value;

      return acc;
    }, {} as IntervalsType);

  const plantingIntervals = createInterval("data_plantio");
  const harvestIntervals = createInterval("data_colheita");

  const months = Array.from(
    { length: endYear - startYear + 1 },
    (_, yearIndex) =>
      Array.from({ length: 12 }, (_, monthIndex) => {
        const month = String(monthIndex + 1).padStart(2, "0");
        const year = startYear + yearIndex;
        return `${year}-${month}`;
      })
  ).flat();

  const categories = Array.from(
    new Set(
      data.map((item) =>
        isValidCategory(item, categoryType)
          ? (item[categoryType] as string)
          : ""
      )
    )
  ).sort();

  const createProcessedData = (intervals: IntervalsType) =>
    months.map((month) => {
      const base = { yearMonth: month } as { yearMonth: string } & {
        [category: string]: number;
      };
      return {
        ...base,
        ...categories.reduce(
          (acc, category) => ({
            ...acc,
            [category]: Number(intervals[month]?.[category] || 0),
          }),
          {} as { [category: string]: number }
        ),
      };
    });

  return {
    plantingData: {
      processedData: createProcessedData(plantingIntervals),
      categories,
    },
    harvestData: {
      processedData: createProcessedData(harvestIntervals),
      categories,
    },
  };
};

type TemporalDataType = {
  datas: AgricultureProps[];
  categoryType: AllowedCategoryTypes;
  selectedChart: string;
  setSelectedChart: (chartName: string) => void;
  chartRef: RefObject<HTMLDivElement>;
};

export default function LineChart({
  datas,
  categoryType,
  selectedChart,
  setSelectedChart,
  chartRef,
}: TemporalDataType) {
  const [currentPage, setCurrentPage] = useState(0);

  const margin = { top: 30, right: 20, bottom: 55, left: 30 };
  const colors = useMemo(() => scaleOrdinal(schemeTableau10), []);
  const height = 200;

  const chartWidth = useChartWidth(chartRef) - 66;
  const width = chartWidth < 0 ? 1 : chartWidth;

  const [selectedFirstYear, setSelectedFirstYear] = useState<number>(0);
  const [selectedLastYear, setSelectedLastYear] = useState<number>(0);
  const [showPlantingLines, setShowPlantingLines] = useState<boolean>(true);
  const [showHarvestLines, setShowHarvestLines] = useState<boolean>(true);
  const [selectedIntervals, setSelectedIntervals] = useState<string[]>([]);
  const [data, setDatas] = useState<AgricultureProps[]>(datas);

  const { propertiesID, updatePropertyID } = usePropertyStore();

  useEffect(() => {
    if (selectedChart !== "LineChart") {
      setSelectedIntervals([]);
      setShowHarvestLines(true);
      setShowPlantingLines(true);
    }
  }, [selectedChart]);

  useEffect(() => {
    if (selectedChart !== "LineChart") {
      setCurrentPage(0);
    }
  }, [selectedChart, data]);

  useEffect(() => {
    if (!showHarvestLines && !showPlantingLines) {
      setShowHarvestLines(true);
      setShowPlantingLines(true);
    }
  }, [showHarvestLines, showPlantingLines]);

  const filteredData = useMemo(() => {
    if (selectedIntervals.length === 0 && selectedChart !== "select") {
      return datas.filter((property) =>
        propertiesID.includes(property.propriedade_id)
      );
    }
    return datas;
  }, [datas, selectedIntervals, selectedChart, propertiesID]);

  useEffect(() => {
    setDatas(filteredData);
    if (selectedChart === "select" && selectedIntervals.length === 0) {
      updatePropertyID(datas.map((property) => property.propriedade_id));
    }
  }, [filteredData, selectedChart, selectedIntervals]);

  useEffect(() => {
    const years = [
      ...new Set([
        ...data.map((item) => new Date(item.data_plantio).getFullYear()),
        ...data.map((item) => new Date(item.data_colheita).getFullYear()),
      ]),
    ];

    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);

    setSelectedFirstYear(minYear);
    setSelectedLastYear(maxYear);
  }, [data, categoryType]);

  const { plantingData, harvestData } = useMemo(
    () => processData(data, selectedFirstYear, selectedLastYear, categoryType),
    [data, selectedFirstYear, selectedLastYear, categoryType]
  );

  const paginatedData = useMemo(() => {
    const start = currentPage * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return plantingData.processedData.slice(start, end);
  }, [plantingData, currentPage]);

  const paginatedDataHarvest = useMemo(() => {
    const start = currentPage * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return harvestData.processedData.slice(start, end);
  }, [harvestData, currentPage]);

  const xScale = scaleBand()
    .domain(paginatedData.map((d) => d.yearMonth.toString()))
    .range([margin.left, width - margin.right])
    .padding(-0.97);

  const yScale = scaleLinear()
    .domain([
      0,
      max(
        plantingData.processedData.flatMap((d) =>
          plantingData.categories.map((culture) => d[culture])
        )
      ) || 0,
    ])
    .range([height - margin.bottom, margin.top]);
  const lineGenerator = line<{ yearMonth: string; value: number }>()
    .x((d) => {
      const xValue = xScale(d.yearMonth);
      return xValue !== undefined ? xValue + xScale.bandwidth() / 2 : 0;
    })
    .y((d) => {
      const yValue = yScale(d.value);
      return yValue !== undefined ? yValue : 0;
    });

  const handleClick = useCallback(
    (
      culture: string,
      event:
        | MouseEvent<SVGGElement, globalThis.MouseEvent>
        | MouseEvent<HTMLLIElement, globalThis.MouseEvent>
    ) => {
      event.stopPropagation();

      if (selectedIntervals.includes(culture)) {
        const updatedIntervals = selectedIntervals.filter((i) => i !== culture);
        setSelectedIntervals(updatedIntervals);
        const remainingItems = datas.filter((item) =>
          updatedIntervals.some((activity) => item.cultura === activity)
        );
        updatePropertyID(
          remainingItems.length
            ? remainingItems.map((property) => property.propriedade_id)
            : data.map((property) => property.propriedade_id)
        );
      } else {
        const updatedIntervals = [...selectedIntervals, culture];
        setSelectedIntervals(updatedIntervals);
        if (selectedChart !== "LineChart") {
          setSelectedChart("LineChart");
          const filteredItems = datas.filter(
            (item) => item.cultura === culture
          );

          updatePropertyID(
            filteredItems.map((property) => property.propriedade_id)
          );
        } else {
          const remainingItems = datas.filter((item) =>
            updatedIntervals.some((activity) => item.cultura === activity)
          );
          updatePropertyID(
            remainingItems.length
              ? remainingItems.map((property) => property.propriedade_id)
              : data.map((property) => property.propriedade_id)
          );
        }
      }
    },
    [
      selectedIntervals,
      setSelectedIntervals,
      data,
      datas,
      selectedChart,
      updatePropertyID,
      setSelectedChart,
    ]
  );

  const handleSvgClick = useCallback(() => {
    setSelectedIntervals([]);
    updatePropertyID(data.map((property) => property.propriedade_id));
  }, [setSelectedIntervals, data, updatePropertyID]);

  const handleNextPage = () => {
    if (
      (currentPage + 1) * ITEMS_PER_PAGE <
      plantingData.processedData.length
    ) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  function EditLabel(label: string) {
    const months = [
      "jan",
      "fev",
      "mar",
      "abr",
      "mai",
      "jun",
      "jul",
      "ago",
      "set",
      "out",
      "nov",
      "dez",
    ];

    const [year, month] = label.split("-");
    return `${months[parseInt(month, 10) - 1]}/${year}`;
  }

  return (
    <>
      <div className={styles.lineChartContainer}>
        {/* Botões de navegação */}
        <div className={styles.navigationButtons}>
          <button onClick={handlePreviousPage} disabled={currentPage === 0}>
            <CaretCircleLeft size={20} weight="fill" />
          </button>
        </div>
        <svg
          className={styles.svgContainer}
          width={width}
          height={height}
          onClick={handleSvgClick}
        >
          <g
            className={styles.nav}
            onClick={() => setShowPlantingLines(!showPlantingLines)}
            style={{
              opacity: showHarvestLines ? "1" : "0.5",
            }}
          >
            <line className={styles.solidLine} x1="0" y1="10" x2="20" y2="10" />
            <text x={60} y={13}>
              Plantio
            </text>
          </g>
          <g
            className={styles.nav}
            onClick={() => setShowHarvestLines(!showHarvestLines)}
            style={{
              opacity: showPlantingLines ? "1" : "0.5",
            }}
          >
            <line
              className={styles.dashedLine}
              x1="80"
              y1="10"
              x2="100"
              y2="10"
            />
            <text x={145} y={13}>
              Colheita
            </text>
          </g>
          {/* Grid Lines */}
          {yScale.ticks().map(
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
                    className={styles.lineLabel}
                    x={margin.left - 10}
                    y={yScale(tick) + 2}
                  >
                    {formatValueWithUnit(
                      VisibilityOptionsAgriculture.Production,
                      tick,
                      optionsUnits
                    )}
                  </text>
                </g>
              )
          )}
          {/* Vertical Grid Lines for Years */}
          {paginatedData.map((d) => {
            const xPos = xScale(d.yearMonth.toString());
            if (xPos === undefined) {
              return null;
            }

            return (
              <line
                className={styles.gridLine}
                key={`grid-${d.yearMonth}`}
                x1={xPos + xScale.bandwidth() / 2}
                x2={xPos + xScale.bandwidth() / 2}
                y1={margin.top}
                y2={height - margin.bottom + 6}
              />
            );
          })}

          {showHarvestLines && (
            <g>
              {/* Lines for Each Category */}
              {plantingData.categories.map((category) => {
                const categoryData = paginatedData.map((d) => ({
                  yearMonth: d.yearMonth,
                  value: Number(d[category]),
                }));

                return (
                  <path
                    key={category}
                    className={styles.path}
                    d={lineGenerator(categoryData) ?? undefined}
                    stroke={colors(String(category))}
                    onClick={(event) => handleClick(category, event)}
                    opacity={
                      selectedIntervals.length === 0 ||
                      selectedIntervals.includes(category)
                        ? 1
                        : 0.2
                    }
                  />
                );
              })}
              <g>
                {/* Circles on Line Vertices */}
                {plantingData.categories.map((category) =>
                  plantingData.processedData.map((d) => {
                    const xPos = xScale(d.yearMonth.toString());
                    if (xPos === undefined) {
                      return null;
                    }

                    return (
                      <Tooltip
                        key={`${category}-${d.yearMonth}`}
                        title={
                          <>
                            <span>
                              {d.yearMonth} - {category}
                            </span>
                            <br />
                            <span>
                              {VisibilityOptionsAgriculture.Production + ": "}
                              {formatValueWithUnit(
                                VisibilityOptionsAgriculture.Production,
                                Number(d[category]),
                                optionsUnits
                              )}
                            </span>
                          </>
                        }
                        placement="right"
                        arrow
                      >
                        <circle
                          className={styles.circle}
                          cx={xPos + xScale.bandwidth() / 2}
                          cy={yScale(Number(d[category]))}
                          r={4}
                          fill={colors(String(category))}
                          onClick={(event) => handleClick(category, event)}
                          opacity={
                            selectedIntervals.length === 0 ||
                            selectedIntervals.includes(category)
                              ? 1
                              : 0.2
                          }
                        />
                      </Tooltip>
                    );
                  })
                )}
              </g>
            </g>
          )}

          {showPlantingLines && (
            <g>
              {/* Lines for Each Category Harvest*/}
              {plantingData.categories.map((category) => {
                const categoryData = paginatedDataHarvest.map((d) => ({
                  yearMonth: d.yearMonth,
                  value: Number(d[category]),
                }));

                return (
                  <path
                    key={category}
                    className={styles.pathDashed}
                    d={lineGenerator(categoryData) ?? undefined}
                    stroke={colors(String(category))}
                    strokeDasharray={3}
                    onClick={(event) => handleClick(category, event)}
                    opacity={
                      selectedIntervals.length === 0 ||
                      selectedIntervals.includes(category)
                        ? 1
                        : 0.2
                    }
                  />
                );
              })}

              <g>
                {/* Circles on Line Vertices */}
                {plantingData.categories.map((category) =>
                  paginatedDataHarvest.map((d) => {
                    const xPos = xScale(d.yearMonth.toString());
                    if (xPos === undefined) {
                      return null;
                    }

                    return (
                      <Tooltip
                        key={`${category}-${d.yearMonth}`}
                        title={
                          <>
                            <span>
                              {d.yearMonth} - {category}
                            </span>
                            <br />
                            <span>
                              {VisibilityOptionsAgriculture.Production + ": "}
                              {formatValueWithUnit(
                                VisibilityOptionsAgriculture.Production,
                                d[category],
                                optionsUnits
                              )}
                            </span>
                          </>
                        }
                        placement="right"
                        arrow
                      >
                        <circle
                          className={styles.strokeCircle}
                          cx={xPos + xScale.bandwidth() / 2}
                          cy={yScale(Number(d[category]))}
                          r={3}
                          stroke={colors(String(category))}
                          onClick={(event) => handleClick(category, event)}
                          opacity={
                            selectedIntervals.length === 0 ||
                            selectedIntervals.includes(category)
                              ? 1
                              : 0.2
                          }
                        />
                      </Tooltip>
                    );
                  })
                )}
              </g>
            </g>
          )}

          {paginatedData.map((d, i) => {
            const xPos = xScale(d.yearMonth.toString());
            if (xPos === undefined) return null;

            const interval = Math.ceil(paginatedData.length / (width / 20));
            if (i % interval !== 0) return null;

            return (
              <text
                className={styles.gridText}
                key={d.yearMonth}
                x={xPos + xScale.bandwidth() / 2 - 10}
                y={height - margin.bottom + 20}
                transform={`rotate(-70, ${xPos + xScale.bandwidth() / 2}, ${
                  height - margin.bottom + 20
                })`}
              >
                {EditLabel(String(d.yearMonth))}
              </text>
            );
          })}
        </svg>
        {/* Botões de navegação */}
        <div className={styles.navigationButtons}>
          <button
            onClick={handleNextPage}
            disabled={
              (currentPage + 1) * ITEMS_PER_PAGE >=
              plantingData.processedData.length
            }
          >
            <CaretCircleRight size={20} weight="fill" />
          </button>
        </div>
      </div>
      <ul
        className={styles.lineChratLegendContainer}
        style={{
          width: `${width}px`,
        }}
      >
        {plantingData.categories.map((category) => (
          <Tooltip
            key={`${category}`}
            title={
              <>
                <span>{category}</span>
              </>
            }
            disableInteractive
          >
            <li onClick={(event) => handleClick(category, event)}>
              <span
                style={{
                  backgroundColor: colors(String(category)),
                  opacity:
                    selectedIntervals.length === 0 ||
                    selectedIntervals.includes(category)
                      ? "1"
                      : "0.5",
                }}
              ></span>
              <p
                style={{
                  opacity:
                    selectedIntervals.length === 0 ||
                    selectedIntervals.includes(category)
                      ? "1"
                      : "0.5",
                }}
              >
                {category}
              </p>
            </li>
          </Tooltip>
        ))}
      </ul>
    </>
  );
}
