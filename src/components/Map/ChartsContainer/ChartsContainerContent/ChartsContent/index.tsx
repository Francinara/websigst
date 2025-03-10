import { ChartBar } from "@phosphor-icons/react";
import styles from "./styles.module.scss";
import { activityMap } from "../../../../../utils/constants";
import Home from "../../../../MapContent/Home";
import Agriculture from "../../../../MapContent/Agriculture";
import Livestock from "../../../../MapContent/Livestock";
import Aquaculture from "../../../../MapContent/Aquaculture";
import Beekeeping from "../../../../MapContent/Beekeeping";
import Craftsmanship from "../../../../MapContent/Craftsmanship";
import OtherActivities from "../../../../MapContent/OtherActivities";
import { useLegendStore } from "../../../../../store/useLegendStore";
import { usePropertyStore } from "../../../../../store/usePropertyStore";
import { useUIStore } from "../../../../../store/useUIStore";

export default function ChartsContent() {
  const { isChartsVisible, activeOption } = useUIStore();

  const legend = useLegendStore();
  const { propertiesID } = usePropertyStore();

  if (!isChartsVisible) return null;

  return (
    <div className={`${styles.contente}`}>
      {propertiesID.length < 1 ||
      (!legend.propertyDensityVisible && !legend.propertyVisible) ? (
        <div className={styles.noProperties}>
          <ChartBar size={100} weight="duotone" className={styles.icon} />
          <h2>Nenhuma propriedade selecionada</h2>
          <p>
            Clique em uma área do mapa para visualizar informações sobre as
            propriedades disponíveis.
          </p>
        </div>
      ) : (
        <>
          {activeOption.value === activityMap.inicio && (
            <>
              <Home />
            </>
          )}
          {activeOption.value === activityMap.agricultura && <Agriculture />}
          {activeOption.value === activityMap.pecuaria && <Livestock />}

          {activeOption.value === activityMap.aquicultura && <Aquaculture />}
          {activeOption.value === activityMap.apicultura && <Beekeeping />}
          {activeOption.value === activityMap.artesanato && <Craftsmanship />}
          {activeOption.value === activityMap.outras_atividades && (
            <OtherActivities />
          )}
        </>
      )}
    </div>
  );
}
