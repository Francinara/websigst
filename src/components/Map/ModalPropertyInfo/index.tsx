import Modal from "react-modal";
import styles from "./styles.module.scss";
import { X } from "@phosphor-icons/react";
import useMapa from "../../../hooks/useMapa";
import { useEffect, useState } from "react";
import {
  AgricultureProps,
  AquacultureProps,
  BeekeepingProps,
  CraftsmanshipProps,
  LivestockProps,
  OtherActivitiesProps,
  WaterResourceByPropertyProps,
} from "../../../contexts/MapContext/types";
import { activityAcess } from "../../../utils/constants";
import WaterResources from "./WaterResources";
import OtherActivities from "./OtherActivities";
import Craftsmanship from "./Craftsmanship";
import Beekeeping from "./Beekeeping";
import Aquaculture from "./Aquaculture";
import Livestock from "./Livestock";
import Agriculture from "./Agriculture";
import { usePropertyStore } from "../../../store/usePropertyStore";

interface ProductiveActivities {
  agriculture: AgricultureProps[];
  livestock: LivestockProps[];
  aquaculture: AquacultureProps[];
  beekeeping: BeekeepingProps[];
  craftsmanship: CraftsmanshipProps[];
  otherActivities: OtherActivitiesProps[];
  waterResources: WaterResourceByPropertyProps[];
}

interface ModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

export function ModalPropertyInfo({ isOpen, onRequestClose }: ModalProps) {
  const customStyles = {
    content: {
      top: "50%",
      bottom: "auto",
      left: "50%",
      right: "auto",
      padding: "20px",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#fff",
      borderRadius: "8px",
      zIndex: 2000,
    },
  };

  const [loading, setLoading] = useState(false);

  const { listProductiveActivityByProperty, listWaterResourceByProperty } =
    useMapa();

  const { property } = usePropertyStore();

  const [productiveActivities, setProductiveActivities] =
    useState<ProductiveActivities>({
      agriculture: [],
      livestock: [],
      aquaculture: [],
      beekeeping: [],
      craftsmanship: [],
      otherActivities: [],
      waterResources: [],
    });
  const [hasProductiveActivity, setHasProductiveActivity] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (property) {
        setLoading(true);

        const agriculture = await listProductiveActivityByProperty(
          property.id,
          activityAcess.agriculture
        );
        const livestock = await listProductiveActivityByProperty(
          property.id,
          activityAcess.livestock
        );
        const aquaculture = await listProductiveActivityByProperty(
          property.id,
          activityAcess.aquaculture
        );

        const craftsmanship = await listProductiveActivityByProperty(
          property.id,
          activityAcess.craftsmanship
        );
        const beekeeping = await listProductiveActivityByProperty(
          property.id,
          activityAcess.beekeeping
        );
        const otherActivities = await listProductiveActivityByProperty(
          property.id,
          activityAcess.other_activities
        );
        const waterResources = await listWaterResourceByProperty(property.id);

        const hasActivity =
          agriculture.length > 0 ||
          livestock.length > 0 ||
          aquaculture.length > 0 ||
          beekeeping.length > 0 ||
          craftsmanship.length > 0 ||
          otherActivities.length > 0;

        setProductiveActivities({
          agriculture,
          livestock,
          aquaculture,
          beekeeping,
          craftsmanship,
          otherActivities,
          waterResources,
        } as ProductiveActivities);

        setLoading(false);
        setHasProductiveActivity(hasActivity);
      }
    }
    fetchData();
  }, [listProductiveActivityByProperty, listWaterResourceByProperty, property]);

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
      {property && (
        <div className={styles.sidebarContainer}>
          <aside className={`${styles.sidebar} scrollable-content`}>
            {loading && (
              <div className={styles.loadingOverlay}>
                <div className={styles.loaderCircle}></div>
              </div>
            )}
            <div className={styles.sidebarHeader}>
              <div className={styles.sidebarHeaderInfo}>
                <div>
                  <h1>{property.nome_propriedade}</h1>
                  <span>
                    <p>Data da visita:</p>
                    <div>{formatDate(property.data)}</div>
                  </span>
                </div>
                <button className={styles.closeButton} onClick={onRequestClose}>
                  <X size={20} weight="bold" />
                </button>
              </div>
              <div className={styles.infoBox}>
                <div className={styles.infoRow}>
                  <div>
                    <p className={styles.label}>Coordenadas</p>
                    <p>
                      {property.lat}, {property.lng}
                    </p>
                  </div>
                  <div className={styles.textRight}>
                    <p className={styles.label}>Área </p>
                    <p>{property.area}Km²</p>
                  </div>
                </div>
                <div className={styles.infoRow}>
                  <div>
                    <p className={styles.label}>Comunidade </p>
                    <p>{property.comunidade}</p>
                  </div>
                  <div className={styles.textRight}>
                    <p className={styles.label}>Distrito </p>
                    <p>{property.distrito}</p>
                  </div>
                </div>
              </div>
              {hasProductiveActivity && (
                <div>
                  <h2 className={styles.title}>Atividades Produtivas</h2>
                  <div className={styles.contentContainer}>
                    <Agriculture
                      activities={productiveActivities.agriculture}
                    />
                    <Livestock activities={productiveActivities.livestock} />
                    <Aquaculture
                      activities={productiveActivities.aquaculture}
                    />
                    <Beekeeping activities={productiveActivities.beekeeping} />
                    <Craftsmanship
                      activities={productiveActivities.craftsmanship}
                    />
                    <OtherActivities
                      activities={productiveActivities.otherActivities}
                    />
                  </div>
                </div>
              )}
              {productiveActivities.waterResources.some(
                (resource) =>
                  resource.acude_id ||
                  resource.banheiro_id ||
                  resource.barragem_id ||
                  resource.carro_pipa_id ||
                  resource.cisternas_id ||
                  resource.poco_id
              ) && (
                <div>
                  <h2 className={styles.title}>Recursos Hídricos</h2>
                  <div className={styles.contentContainer}>
                    <WaterResources
                      waterResources={productiveActivities.waterResources}
                    />
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </Modal>
  );
}
