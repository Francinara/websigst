import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import TextCard from "./TextCard";
import { useWaterResources } from "../../hooks/useWaterResources";
import { usePropertyStore } from "../../store/usePropertyStore";

import { CompleteProductiveActivity } from "../../utils/types";
import VerticalBarChart from "./charts/VerticalBarChart";

export default function WaterResourcesChart() {
  const { data: water_resources } = useWaterResources();
  const chartRef = useRef<HTMLDivElement>(null);

  const { propertiesID } = usePropertyStore();

  const [totalPocos, setTotalPocos] = useState(0);
  const [totalCarrosPipas, setTotalCarrosPipas] = useState(0);
  const [totalPocoAmazonas, setTotalPocoAmazonas] = useState(0);
  const [totalAcudes, setTotalAcudes] = useState(0);
  const [totalBarragens, setTotalBarragens] = useState(0);
  const [totalCisternas, setTotalCisternas] = useState(0);

  useEffect(() => {
    const filteredActivities = water_resources?.filter((water_resource) =>
      propertiesID.some(
        (property) => water_resource.propriedade_id === property
      )
    );

    const totPocos = filteredActivities?.reduce(
      (acc, water_resource) => acc + (water_resource.poco_id != null ? 1 : 0),
      0
    );
    const totCarrosPipas = filteredActivities?.reduce(
      (acc, water_resource) =>
        acc + (water_resource.carro_pipa_id != null ? 1 : 0),
      0
    );
    const totPocoAmazonas = filteredActivities?.reduce(
      (acc, water_resource) =>
        acc + (water_resource.poco_amazonas_id != null ? 1 : 0),
      0
    );
    const totAcudes = filteredActivities?.reduce(
      (acc, water_resource) => acc + (water_resource.acude_id != null ? 1 : 0),
      0
    );
    const totBarragens = filteredActivities?.reduce(
      (acc, water_resource) =>
        acc + (water_resource.barragem_id != null ? 1 : 0),
      0
    );
    const totCisterna = filteredActivities?.reduce(
      (acc, water_resource) =>
        acc + (water_resource.cisternas_id != null ? 1 : 0),
      0
    );

    setTotalPocos(totPocos ?? 0);
    setTotalCarrosPipas(totCarrosPipas ?? 0);
    setTotalPocoAmazonas(totPocoAmazonas ?? 0);
    setTotalAcudes(totAcudes ?? 0);
    setTotalBarragens(totBarragens ?? 0);
    setTotalCisternas(totCisterna ?? 0);
  }, [propertiesID, water_resources]);

  return (
    <>
      <TextCard
        title={"Recursos Hídricos"}
        text={`Poços: ${totalPocos} Propriedades 
        \nPoços Amazonas: ${totalPocoAmazonas} propriedade
        \nAçudes: ${totalAcudes} propriedades
        \nBarragens: ${totalBarragens} propriedades
        \nCisternas: ${totalCisternas} propriedades
        \nUso de Carros-Pipa: ${totalCarrosPipas} propriedades`}
      />
      <div ref={chartRef} className="flex gap-3">
        <div className="flex flex-col  p-3 bg-white rounded-lg border flex-1">
          <h2 className="text-base font-semibold text-gray-600 mb-4">
            Capacidade de Armazenamento Total
          </h2>
          <div className="flex flex-col items-center justify-center h-full flex-1 ">
            {water_resources && (
              <VerticalBarChart
                chartRef={chartRef}
                height={110}
                datas={water_resources as CompleteProductiveActivity[]}
                chartName="Quantidade de propriedades por Cultura"
                color={d3.schemeTableau10[0]}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
