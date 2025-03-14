import { useEffect, useRef, useState } from "react";
import { useProductiveActivities } from "../../hooks/useActiviteProductivies";
import { activityAcess } from "../../utils/constants";
import { usePropertyStore } from "../../store/usePropertyStore";
import { formatNumber } from "../../utils/formatUtils";
import {
  CompleteProductiveActivity,
  VisibilityOptionsAgriculture,
} from "../../utils/types";
import { schemeTableau10 } from "d3";
import TextCard from "./TextCard";
import PieChart from "./charts/PieChart";
import HorizontalBarChart from "./charts/HorizontalBarChart";

export default function AquacultureChart() {
  const { data: activities } = useProductiveActivities(
    activityAcess.aquaculture
  );
  const chartRef = useRef<HTMLDivElement>(null);

  const { propertiesID } = usePropertyStore();

  const [totalProductiveActivities, setTotalProductiveActivities] = useState(0);
  useEffect(() => {
    const filteredActivities = activities?.filter((activity) =>
      propertiesID.some((property) => activity.propriedade_id === property)
    );

    const total = filteredActivities?.reduce((acc, activity) => {
      if ("quantidade" in activity) {
        return acc + (activity.quantidade || 0);
      }
      return acc;
    }, 0);

    setTotalProductiveActivities(total ?? 0);
  }, [propertiesID, activities]);

  return (
    <>
      <TextCard
        title={"Aquicultura"}
        text={`Produção total: ${formatNumber(totalProductiveActivities)} kg`}
      />
      <div ref={chartRef} className="flex gap-3">
        <div className="flex flex-col  p-3 bg-white rounded-lg border flex-1">
          <h2 className="text-base font-semibold text-gray-600 mb-4">
            Espécies Mais Comuns
          </h2>
          <div className="flex flex-col items-center justify-center h-full flex-1 ">
            {activities && (
              <HorizontalBarChart
                chartRef={chartRef}
                height={110}
                datas={activities as CompleteProductiveActivity[]}
                selectedChart=""
                chartName="Quantidade de propriedades por Espécie"
                field="especie"
                countLogic={(items) => items.length}
                VisibilityOptionsAgriculture={
                  VisibilityOptionsAgriculture.Property
                }
                color={schemeTableau10[3]}
              />
            )}
          </div>
        </div>
        <div className="flex flex-col p-3 bg-white rounded-lg border flex-1">
          <h2 className="text-base font-semibold text-gray-600 mb-4">
            Destino da Produção
          </h2>
          <div className="flex flex-col items-center justify-center h-full flex-1 ">
            {activities && (
              <PieChart
                width={128}
                height={50}
                datas={activities as CompleteProductiveActivity[]}
                selectedChart=""
                chartName="Destino da produção"
                districts={["Casa", "Venda"]}
                getValue={(district, item) =>
                  Number(
                    district === "Casa"
                      ? item.destinacao_casa
                      : item.destinacao_verda
                  )
                }
                label="kg"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
