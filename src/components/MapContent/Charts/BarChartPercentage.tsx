import { MouseEvent, RefObject, useEffect, useState } from "react";
import { scaleLinear, scaleBand, schemeTableau10 } from "d3";
import { WaterResourceProps } from "../../../contexts/MapContext/types";
import { Tooltip } from "@mui/material";

import styles from "./styles.module.scss";
import { useChartWidth } from "../../../hooks/useChartWidth";
import { usePropertyStore } from "../../../store/usePropertyStore";

enum waterRecourceMap {
  carro_pipa_id = "Carro Pipa",
  poco_id = "Poço",
  poco_amazonas_id = "Poço Amazonas",
  acude_id = "Açude",
  barragem_id = "Barragem",
  banheiro_id = "Banheiro",
  cisternas_id = "Cisterna",
}

interface WaterResourceData {
  waterResource: string;
  withWaterResourceCount: number;
  withoutWaterResourceCount: number;
  itemsWithWaterResource: WaterResourceProps[];
  itemsWithoutWaterResource: WaterResourceProps[];
}

const processDataByWaterResource = (data: WaterResourceProps[]) => {
  const waterResourceData: WaterResourceData[] = [];

  const waterResourceTypes = [
    "carro_pipa_id",
    "poco_id",
    "poco_amazonas_id",
    "acude_id",
    "barragem_id",
    "banheiro_id",
    "cisternas_id",
  ];

  waterResourceTypes.forEach((waterResource) => {
    const itemsWithWaterResource = data.filter(
      (item) => item[waterResource as keyof WaterResourceProps]
    );
    const itemsWithoutWaterResource = data.filter(
      (item) => !item[waterResource as keyof WaterResourceProps]
    );

    waterResourceData.push({
      waterResource,
      withWaterResourceCount: itemsWithWaterResource.length,
      withoutWaterResourceCount: itemsWithoutWaterResource.length,
      itemsWithWaterResource,
      itemsWithoutWaterResource,
    });
  });

  return waterResourceData;
};

export default function BarChartPercentage({
  height,
  datas,
  selectedChart,
  setSelectedChart,
  chartRef,
}: {
  height: number;
  datas: WaterResourceProps[];
  selectedChart: string;
  setSelectedChart: (chartName: string) => void;
  chartRef: RefObject<HTMLDivElement>;
}) {
  const { propertiesID, updatePropertyID } = usePropertyStore();
  const [selectedWaterResources, setSelectedWaterResources] = useState<
    string[]
  >([]);

  const [data, setDatas] = useState<WaterResourceProps[]>(datas);

  const chartWidth = useChartWidth(chartRef) - 26;
  const width = chartWidth < 0 ? 1 : chartWidth;

  useEffect(() => {
    if (selectedChart !== "BarChartWaterResource") {
      setSelectedWaterResources([]);
    }
  }, [selectedChart]);

  useEffect(() => {
    if (selectedWaterResources.length === 0) {
      setDatas(
        datas.filter((property) =>
          propertiesID.includes(property.propriedade_id)
        )
      );
    } else {
      setDatas(datas);
    }
  }, [selectedWaterResources, datas, propertiesID, selectedChart]);

  const margin = { top: 10, right: 20, bottom: 30, left: 82 };

  const processedData = processDataByWaterResource(data);

  const xScale = scaleLinear()
    .domain([0, 100])
    .range([margin.left, width - margin.right]);

  const yScale = scaleBand()
    .domain(processedData.map((d) => d.waterResource))
    .range([margin.top, height - margin.bottom])
    .padding(0.1);

  const handleClick = (
    waterResource: string,
    itemsWithWaterResource: WaterResourceProps[],
    itemsWithoutWaterResource: WaterResourceProps[],
    event:
      | MouseEvent<SVGGElement, globalThis.MouseEvent>
      | MouseEvent<HTMLLIElement, globalThis.MouseEvent>
  ) => {
    event.stopPropagation();

    if (selectedWaterResources.includes(waterResource)) {
      const updatedWaterResources = selectedWaterResources.filter(
        (a) => a !== waterResource
      );
      setSelectedWaterResources(updatedWaterResources);

      const remainingItems = datas.filter((item) => {
        const result = updatedWaterResources.some((waterResource) => {
          const match = waterResource.match(/^(with|without)_(.+)/);
          if (!match) {
            return [];
          }
          const beforeUnderline = match[1];
          const currentWaterResource = match[2];

          if (beforeUnderline === "with") {
            return (
              item[currentWaterResource as keyof WaterResourceProps] != null
            );
          } else {
            return (
              item[currentWaterResource as keyof WaterResourceProps] === null
            );
          }
        });

        return result;
      });
      updatePropertyID(
        remainingItems.length > 1
          ? remainingItems.map((property) => property.propriedade_id)
          : data.map((property) => property.propriedade_id)
      );
    } else {
      setSelectedWaterResources([...selectedWaterResources, waterResource]);
      if (selectedChart !== "BarChartWaterResource") {
        setSelectedChart("BarChartWaterResource");
        const filteredItems = datas.filter((item) => {
          const match = waterResource.match(/^(with|without)_(.+)/);

          if (!match) {
            return [];
          }

          const beforeUnderline = match[1];
          const currentWaterResource = match[2];

          if (beforeUnderline === "with") {
            return (
              item[currentWaterResource as keyof WaterResourceProps] != null
            );
          } else {
            return (
              item[currentWaterResource as keyof WaterResourceProps] === null
            );
          }
        });
        updatePropertyID(
          filteredItems.map((property) => property.propriedade_id)
        );
      } else {
        const match = waterResource.match(/^(with|without)_(.+)/);

        if (!match) {
          return [];
        }
        const beforeUnderline = match[1];
        const withWR = beforeUnderline === "with";

        updatePropertyID([
          ...new Set(
            [
              ...selectedWaterResources.flatMap((a) => {
                const match = a.match(/^(with|without)_(.+)/);

                if (!match) {
                  return [];
                }

                const currentWaterResource = match[2];
                const beforeUnderline = match[1];
                const withWR = beforeUnderline === "with";

                return (
                  processedData.find((d) => {
                    return d.waterResource === currentWaterResource;
                  })?.[
                    withWR
                      ? "itemsWithWaterResource"
                      : "itemsWithoutWaterResource"
                  ] || []
                );
              }),
              ...(withWR ? itemsWithWaterResource : itemsWithoutWaterResource),
            ].map((property) => property.propriedade_id)
          ),
        ]);
      }
    }
  };

  const handleSvgClick = () => {
    setSelectedWaterResources([]);
    updatePropertyID(data.map((property) => property.propriedade_id));
  };

  const gridLines = xScale.ticks().map(
    (tick) =>
      Number.isInteger(tick) && (
        <g key={tick}>
          <line
            className={styles.gridLine}
            y1={margin.top}
            y2={height - margin.bottom}
            x1={xScale(tick)}
            x2={xScale(tick)}
          />
          <text
            className={styles.gridText}
            y={height - margin.bottom + 10}
            x={xScale(tick)}
          >
            {tick}%
          </text>
        </g>
      )
  );

  return (
    <div className={styles.barChartContainer}>
      <svg
        width={width}
        height={height}
        onClick={handleSvgClick}
        aria-label="Gráfico de Barras"
      >
        {gridLines}

        {processedData.map((d) => {
          const totalProperties =
            d.withWaterResourceCount + d.withoutWaterResourceCount;
          const percentageWithWaterResource =
            totalProperties > 0
              ? (d.withWaterResourceCount / totalProperties) * 100
              : 0;
          const percentageWithoutWaterResource =
            totalProperties > 0
              ? (d.withoutWaterResourceCount / totalProperties) * 100
              : 0;

          return (
            <g key={d.waterResource}>
              <Tooltip
                title={`Possui ${
                  waterRecourceMap[
                    d.waterResource as keyof typeof waterRecourceMap
                  ]
                }: ${d.withWaterResourceCount} Propriedades`}
                disableInteractive
              >
                <rect
                  className={styles.bar}
                  y={yScale(d.waterResource)}
                  x={xScale(0)}
                  width={xScale(percentageWithWaterResource) - xScale(0)}
                  height={yScale.bandwidth()}
                  fill={schemeTableau10[0]}
                  opacity={
                    selectedWaterResources.length === 0 ||
                    selectedWaterResources.includes(`with_${d.waterResource}`)
                      ? 1
                      : 0.5
                  }
                  onClick={(event) =>
                    handleClick(
                      `with_${d.waterResource}`,
                      d.itemsWithWaterResource,
                      d.itemsWithoutWaterResource,
                      event
                    )
                  }
                />
              </Tooltip>

              <Tooltip
                title={`Não Possui ${
                  waterRecourceMap[
                    d.waterResource as keyof typeof waterRecourceMap
                  ]
                }: ${d.withoutWaterResourceCount} Propriedades`}
                disableInteractive
              >
                <rect
                  className={styles.bar}
                  y={yScale(d.waterResource)}
                  x={xScale(100 - percentageWithoutWaterResource)}
                  width={xScale(percentageWithoutWaterResource) - xScale(0)}
                  height={yScale.bandwidth()}
                  fill={schemeTableau10[2]}
                  opacity={
                    selectedWaterResources.length === 0 ||
                    selectedWaterResources.includes(
                      `without_${d.waterResource}`
                    )
                      ? 1
                      : 0.5
                  }
                  onClick={(event) =>
                    handleClick(
                      `without_${d.waterResource}`,
                      d.itemsWithWaterResource,
                      d.itemsWithoutWaterResource,
                      event
                    )
                  }
                />
              </Tooltip>

              <text
                className={styles.barLabel}
                x={margin.left - 10}
                y={(yScale(d.waterResource) ?? 0) + yScale.bandwidth() / 2}
                alignmentBaseline="middle"
              >
                {
                  waterRecourceMap[
                    d.waterResource as keyof typeof waterRecourceMap
                  ]
                }
              </text>
            </g>
          );
        })}
      </svg>
      <div>
        <ul className={styles.legendContainer}>
          <Tooltip title={"Possui Recurso Hídrico"} disableInteractive>
            <li>
              <span style={{ backgroundColor: schemeTableau10[0] }} />
              <p>Possui Recurso Hídrico</p>
            </li>
          </Tooltip>
          <Tooltip title={"Não Possui Recurso Hídrico"} disableInteractive>
            <li>
              <span style={{ backgroundColor: schemeTableau10[2] }} />
              <p>Não Possui Recurso Hídrico</p>
            </li>
          </Tooltip>
        </ul>
      </div>
    </div>
  );
}
