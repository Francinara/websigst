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
import { CraftsmanshipProps } from "../../services/productive-activities/productiveActivitiesApi";
import TextCard from "./TextCard";
import PieChart from "./charts/PieChart";
import HorizontalBarChart from "./charts/HorizontalBarChart";

export default function CraftsmanshipChart() {
  const { data: activities } = useProductiveActivities(
    activityAcess.craftsmanship
  );
  const chartRef = useRef<HTMLDivElement>(null);
  const { propertiesID } = usePropertyStore();
  const [totalProperties, setTotalProperties] = useState(0);

  useEffect(() => {
    const filteredActivities = activities?.filter((activity) =>
      propertiesID.some((property) => activity.propriedade_id === property)
    );
    const total = filteredActivities?.length;
    setTotalProperties(total ?? 0);
  }, [propertiesID, activities]);

  return (
    <>
      <TextCard
        title="Artesanato"
        text={`Total de propriedades com Atividades Artesanais: ${formatNumber(
          totalProperties,
          0
        )} Propriedades`}
      />
      <div ref={chartRef} className="flex gap-3">
        <div className="flex flex-col  p-3 bg-white rounded-lg border flex-1">
          <h2 className="text-base font-semibold text-gray-600 mb-4">
            Produtos Mais Comuns
          </h2>
          <div className="flex flex-col items-center justify-center h-full flex-1 ">
            {activities && (
              <HorizontalBarChart
                chartRef={chartRef}
                height={110}
                datas={activities as CompleteProductiveActivity[]}
                selectedChart=""
                chartName="Quantidade de Propriedades por Produto"
                field="produto"
                countLogic={(items) => items.length}
                VisibilityOptionsAgriculture={
                  VisibilityOptionsAgriculture.Property
                }
                color={schemeTableau10[6]}
              />
            )}
          </div>
        </div>
        <div className="flex flex-col p-3 bg-white rounded-lg border flex-1">
          <h2 className="text-base font-semibold text-gray-600 mb-4">
            Locais de comercialização
          </h2>
          <div className="flex flex-col items-center justify-center h-full flex-1 ">
            {activities && (
              <PieChart
                width={128}
                height={50}
                datas={activities as CompleteProductiveActivity[]}
                selectedChart=""
                chartName="Locais de comercialização dos Produtos"
                districts={[
                  ...new Set(
                    activities
                      .filter((activity) => "destinacao_valor" in activity)
                      .map(
                        (craftsmanship) =>
                          (craftsmanship as CraftsmanshipProps).destinacao_valor
                      )
                  ),
                ]}
                getValue={(district, item) =>
                  Number(item.destinacao_valor === district ? 1 : 0)
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
