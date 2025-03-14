export type VisitsProps = {
  numero: number;
  data: string;
  tecnico_responsavel: string;
  data_ultima_visita: string;
  diagnostico: string;
  recomendacoes: string;
  finalidade_visita: string;
  propriedade_id: number;
};

import { useEffect, useState, useMemo, useRef } from "react";
import { line, max, scaleBand, scaleLinear } from "d3";
import { Tooltip } from "@mui/material";
import styles from "./styles.module.scss";
import { useChartWidth } from "../../../hooks/useChartWidth";
import { usePropertyStore } from "../../../store/usePropertyStore";

const processData = (
  data: VisitsProps[],
  startYear: number,
  endYear: number
) => {
  // Contar visitas por ano
  const visitsByYear = data.reduce((acc, item) => {
    const year = new Date(item.data).getFullYear();
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  // Gerar array com todos os anos no intervalo
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  );

  // Criar dados processados com visitas por ano (0 se não houver visitas)
  const processedData = years.map((year) => ({
    year,
    visits: visitsByYear[year] || 0,
  }));

  return processedData;
};

type TemporalDataType = {
  datas: VisitsProps[];
  selectedChart: string;
  chartName: string;
};

export default function LineChart({
  datas,
  selectedChart,
  chartName,
}: TemporalDataType) {
  const [selectedFirstYear, setSelectedFirstYear] = useState<number>(0);
  const [selectedLastYear, setSelectedLastYear] = useState<number>(0);
  const { propertiesID, updatePropertyID } = usePropertyStore();

  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  const [data, setDatas] = useState<VisitsProps[]>(datas);

  useEffect(() => {
    if (selectedChart !== chartName) {
      setSelectedActivities([]);
    }
  }, [selectedChart, chartName]);

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

  useEffect(() => {
    const years = [
      ...new Set(data.map((item) => new Date(item.data).getFullYear())),
    ];
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);

    setSelectedFirstYear(minYear);
    setSelectedLastYear(maxYear);
  }, [data]);

  const processedData = useMemo(
    () => processData(data, selectedFirstYear, selectedLastYear),
    [data, selectedFirstYear, selectedLastYear]
  );

  const margin = { top: 5, right: 15, bottom: 20, left: 30 };
  const height = 100;
  const chartRef = useRef<HTMLDivElement>(null);
  const width = useChartWidth(chartRef);

  const xScale = scaleBand()
    .domain(processedData.map((d) => d.year.toString()))
    .range([margin.left, width - margin.right])
    .padding(-0.97);

  const yScale = scaleLinear()
    .domain([0, max(processedData.map((d) => d.visits)) || 0])
    .range([height - margin.bottom, margin.top]);

  const lineGenerator = line<{ year: number; visits: number }>()
    .x((d) => {
      const xValue = xScale(d.year.toString());
      return xValue !== undefined ? xValue + xScale.bandwidth() / 2 : 0;
    })
    .y((d) => yScale(d.visits) || 0);

  return (
    <div className={styles.chartSVGContent}>
      <div className={styles.chartContainer}>
        <div ref={chartRef} className={styles.chartSVGSection}>
          <svg
            width={Math.max(0, width)}
            height={height}
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
                      {tick}
                    </text>
                  </g>
                )
            )}
            {/* Vertical Grid Lines for Years */}
            {processedData.map((d, i) => {
              const xPos = xScale(d.year.toString());
              if (xPos === undefined) return null;

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
            <path
              className={styles.path}
              d={lineGenerator(processedData) ?? undefined}
              stroke="#1f77b4"
            />
            {processedData.map((d) => {
              const xPos = xScale(d.year.toString());
              if (xPos === undefined) return null;

              return (
                <Tooltip
                  key={`visits-${d.year}`}
                  title={
                    <>
                      <span>{d.year}</span>
                      <br />
                      <span>{d.visits} visitas</span>
                    </>
                  }
                  placement="right"
                  arrow
                >
                  <circle
                    className={styles.circle}
                    cx={xPos + xScale.bandwidth() / 2}
                    cy={yScale(d.visits)}
                    r={4}
                    fill="#1f77b4"
                  />
                </Tooltip>
              );
            })}
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
        </div>
      </div>
    </div>
  );
}
