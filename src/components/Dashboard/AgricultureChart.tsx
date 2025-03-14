import { useEffect, useRef, useState } from "react";
import { useProductiveActivities } from "../../hooks/useActiviteProductivies";
import { activityAcess } from "../../utils/constants";
import {
  CompleteProductiveActivity,
  VisibilityOptionsAgriculture,
} from "../../utils/types";
import { usePropertyStore } from "../../store/usePropertyStore";
import { formatNumber } from "../../utils/formatUtils";
import { schemeTableau10 } from "d3";
import TextCard from "./TextCard";
import PieChart from "./charts/PieChart";
import HorizontalBarChart from "./charts/HorizontalBarChart";

export default function AgricultureChart() {
  const { data: activities } = useProductiveActivities(
    activityAcess.agriculture
  );
  const chartRef = useRef<HTMLDivElement>(null);

  const { propertiesID } = usePropertyStore();

  const [totalProductiveActivities, setTotalProductiveActivities] = useState(0);
  const [totalCultivationArea, setTotalCultivationArea] = useState(0);
  useEffect(() => {
    const filteredActivities = activities?.filter((activity) =>
      propertiesID.some((property) => activity.propriedade_id === property)
    );

    const total = filteredActivities?.reduce((acc, activity) => {
      if ("producao_ano" in activity) {
        return acc + (activity.producao_ano || 0);
      }
      return acc;
    }, 0);

    const totCultivationArea = filteredActivities?.reduce((acc, activity) => {
      if ("area_cultivo" in activity) {
        return acc + (activity.area_cultivo || 0);
      }
      return acc;
    }, 0);

    setTotalProductiveActivities(total ?? 0);
    setTotalCultivationArea(totCultivationArea ?? 0);
  }, [propertiesID, activities]);

  return (
    <>
      <TextCard
        title={"Agricultura"}
        text={`Produção Agrícola Total: ${formatNumber(
          totalProductiveActivities
        )} sacas \n Área Cultivada Total: ${formatNumber(
          totalCultivationArea
        )} ha`}
      />
      <div ref={chartRef} className="flex gap-3">
        <div className="flex flex-col  p-3 bg-white rounded-lg border flex-1">
          <h2 className="text-base font-semibold text-gray-600 mb-4">
            Culturas Mais Comuns
          </h2>
          <div className="flex flex-col items-center justify-center h-full flex-1 ">
            {activities && (
              <HorizontalBarChart
                chartRef={chartRef}
                height={110}
                datas={activities as CompleteProductiveActivity[]}
                selectedChart=""
                chartName="Quantidade de propriedades por Cultura"
                field="cultura"
                countLogic={(items) => items.length}
                VisibilityOptionsAgriculture={
                  VisibilityOptionsAgriculture.Property
                }
                color={schemeTableau10[4]}
              />
            )}
          </div>
        </div>
        <div className="flex flex-col p-3 bg-white rounded-lg border flex-1">
          <h2 className="text-base font-semibold text-gray-600 mb-4">
            Uso de Irrigação
          </h2>
          <div className="flex flex-col items-center justify-center h-full flex-1 ">
            {activities && (
              <PieChart
                width={128}
                height={50}
                datas={activities as CompleteProductiveActivity[]}
                selectedChart=""
                chartName="Presença de sistemas de irrigação nas culturas"
                districts={["Não Possui irrigação", "Possui Irrigação"]}
                getValue={(district, item) =>
                  Number(
                    district === "Possui Irrigação"
                      ? item.irrigacao
                      : !item.irrigacao
                  )
                }
                label="Culturas"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
