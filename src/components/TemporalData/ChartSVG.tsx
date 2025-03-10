import {
  useMemo,
  MouseEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useRef,
} from "react";
import { formatValueWithUnit } from "../../utils/formatUtils";
import { Tooltip } from "@mui/material";
import { line, max, scaleBand, scaleLinear, scaleOrdinal } from "d3";
import { schemeTableau10 } from "d3-scale-chromatic";
import { OptionsUnits, VisibilityOptions } from "../../utils/types";

import styles from "./styles.module.scss";
import { useChartWidth } from "../../hooks/useChartWidth";

type ChartSVG = {
  categories: string[];
  selectedCategory: string;
  selectedIntervals: string[];
  setSelectedIntervals: Dispatch<SetStateAction<string[]>>;
  selectedButton: VisibilityOptions;
  optionsUnits: OptionsUnits;
  processedData: {
    [category: string]: number;
    year: number;
  }[];
  optionsTitles: OptionsUnits;
};

export default function ChartSVG({
  categories,
  selectedCategory,
  selectedIntervals,
  setSelectedIntervals,
  selectedButton,
  optionsUnits,
  processedData,
  optionsTitles,
}: ChartSVG) {
  const margin = { top: 10, right: 20, bottom: 30, left: 70 };
  const colors = useMemo(() => scaleOrdinal(schemeTableau10), []);
  const height = 310;
  const chartRef = useRef<HTMLDivElement>(null);
  const width = useChartWidth(chartRef);

  function getChartTitle(option: VisibilityOptions): string {
    const title = (optionsTitles as Record<typeof option, string>)[option];

    return selectedCategory != "all" ? `${title} - ${selectedCategory}` : title;
  }

  const xScale = scaleBand()
    .domain(processedData.map((d) => d.year.toString()))
    .range([margin.left, width - margin.right])
    .padding(-0.97);

  const yScale = scaleLinear()
    .domain([
      0,
      max(
        processedData.flatMap((d) => categories.map((culture) => d[culture]))
      ) || 0,
    ])
    .range([height - margin.bottom, margin.top]);

  const lineGenerator = line<{ year: number; value: number }>()
    .x((d) => {
      const xValue = xScale(d.year.toString());
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
      } else {
        const updatedIntervals = [...selectedIntervals, culture];
        setSelectedIntervals(updatedIntervals);
      }
    },
    [selectedIntervals, setSelectedIntervals]
  );

  const handleSvgClick = useCallback(() => {
    setSelectedIntervals([]);
  }, [setSelectedIntervals]);

  return (
    <div className={styles.chartSVGContent}>
      <h2 className={styles.chartSVGTitle}>{getChartTitle(selectedButton)}</h2>
      <div className={styles.chartContainer}>
        <div ref={chartRef} className={styles.chartSVGSection}>
          <svg
            width={width}
            height={height}
            onClick={handleSvgClick}
            className={styles.chartSVG}
          >
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
                      {formatValueWithUnit(selectedButton, tick, optionsUnits)}
                    </text>
                  </g>
                )
            )}
            {/* Vertical Grid Lines for Years */}
            {processedData.map((d, i) => {
              const xPos = xScale(d.year.toString());
              if (xPos === undefined) {
                return null;
              }

              const interval = Math.ceil(processedData.length / (width / 70));
              if (i % interval !== 0) return null;

              return (
                <line
                  key={`grid-${d.year}`}
                  className={styles.gridLine}
                  x1={xPos + xScale.bandwidth() / 2}
                  x2={xPos + xScale.bandwidth() / 2}
                  y1={margin.top}
                  y2={height - margin.bottom + 6}
                />
              );
            })}
            {/* Lines for Each Category */}
            {categories.map((category) => {
              const categoryData = processedData
                .filter(
                  () =>
                    selectedCategory === "all" || category === selectedCategory
                )
                .map((d) => ({
                  year: d.year,
                  value: d[category],
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
              {categories.map((category) =>
                processedData
                  .filter(
                    () =>
                      selectedCategory === "all" ||
                      category === selectedCategory
                  )
                  .map((d) => {
                    const xPos = xScale(d.year.toString());
                    if (xPos === undefined) {
                      return null;
                    }

                    return (
                      <Tooltip
                        key={`${category}-${d.year}`}
                        title={
                          <>
                            <span>
                              {d.year} - {category}
                            </span>
                            <br />
                            <span>
                              {selectedButton + ": "}
                              {formatValueWithUnit(
                                selectedButton,
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
                          className={styles.circle}
                          cx={xPos + xScale.bandwidth() / 2}
                          cy={yScale(d[category])}
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

            {processedData.map((d, i) => {
              const xPos = xScale(d.year.toString());
              if (xPos === undefined) return null;

              const interval = Math.ceil(processedData.length / (width / 70));
              if (i % interval !== 0) return null;

              return (
                <text
                  className={styles.gridText}
                  key={d.year}
                  x={xPos + xScale.bandwidth() / 2}
                  y={height - margin.bottom + 20}
                >
                  {d.year}
                </text>
              );
            })}
          </svg>
          {selectedCategory === "all" && (
            <ul
              className={styles.lineChratLegendContainer}
              style={{
                padding: `0px ${margin.right}px 12px ${margin.left}px `,
              }}
            >
              {categories.map((category) => (
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
          )}
        </div>
        <span className={styles.invisible}></span>
      </div>
    </div>
  );
}
