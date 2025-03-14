import { useEffect, useState } from "react";
import { useProductiveActivities } from "../../hooks/useActiviteProductivies";
import { activityAcess } from "../../utils/constants";
import { usePropertyStore } from "../../store/usePropertyStore";
import { formatNumber } from "../../utils/formatUtils";
import { CompleteProductiveActivity } from "../../utils/types";
import { BeekeepingProps } from "../../services/productive-activities/productiveActivitiesApi";
import PieChart from "./charts/PieChart";
import TextCard from "./TextCard";

export default function BeekeepingChart() {
  const { data: activities } = useProductiveActivities(
    activityAcess.beekeeping
  );
  const { propertiesID } = usePropertyStore();

  const [totalColmeias, setTotalColmeias] = useState(0);

  useEffect(() => {
    const filteredActivities = activities?.filter((activity) =>
      propertiesID.some((property) => activity.propriedade_id === property)
    );

    const total = filteredActivities?.reduce((acc, activity) => {
      if ("n_colmeias" in activity) {
        return acc + (activity.n_colmeias || 0);
      }
      return acc;
    }, 0);

    setTotalColmeias(total ?? 0);
  }, [propertiesID, activities]);
  return (
    <>
      <TextCard
        title={"Apicultura"}
        text={`Total de Colmeias: ${formatNumber(totalColmeias, 0)}`}
      />
      <div className="flex gap-3">
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
                chartName="Locais de comercialização do Mel"
                districts={[
                  ...new Set(
                    activities
                      .filter((activity) => "destinacao_mel" in activity)
                      .map(
                        (beekeeping) =>
                          (beekeeping as BeekeepingProps).destinacao_mel
                      )
                  ),
                ]}
                getValue={(district, item) =>
                  Number(item.destinacao_mel === district ? 1 : 0)
                }
                label="Kg"
              />
            )}
          </div>
        </div>
        <div className="flex flex-col p-3 bg-white rounded-lg border flex-1">
          <h2 className="text-base font-semibold text-gray-600 mb-4">
            Tipos de Manejo
          </h2>
          <div className="flex flex-col items-center justify-center h-full flex-1 ">
            {activities && (
              <PieChart
                width={128}
                height={50}
                datas={activities as CompleteProductiveActivity[]}
                selectedChart=""
                chartName="Tipos de manejo de abelhas nas propriedades"
                districts={["Criação", "Extrativismo"]}
                getValue={(district, item) =>
                  Number(
                    district === "Criação"
                      ? item.tipo_criacao
                      : item.tipo_extrativismo
                  )
                }
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
