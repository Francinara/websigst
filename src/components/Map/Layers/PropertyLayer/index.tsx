import { PropertyProps } from "../../../../contexts/MapContext/types";
import { Marker, Popup } from "react-leaflet";
import * as L from "leaflet";
import greenPinImage from "../../../../assets/green_pin.png";
// import redPinImage from "../../../../assets/red_pin.png";
import shadowImage from "../../../../assets/shadow.png";
import { ModalPropertyInfo } from "../../ModalPropertyInfo";
import { useEffect, useState } from "react";
import Modal from "react-modal";

import "./styles.scss";
import styles from "./styles.module.scss";
import {
  ArrowsOutSimple,
  Cow,
  Fish,
  HandCoins,
  MapPin,
  Plant,
  Plus,
} from "@phosphor-icons/react";
import { HiveOutlined } from "@mui/icons-material";
import { usePropertyStore } from "../../../../store/usePropertyStore";
import { useUIStore } from "../../../../store/useUIStore";

const customIcon = new L.Icon({
  iconUrl: greenPinImage,
  shadowUrl: shadowImage,
  iconSize: [20, 30],
  shadowSize: [20, 10],
  iconAnchor: [10, 32],
  shadowAnchor: [4, 11],
  popupAnchor: [0, -10],
});
// const customIconRed = new L.Icon({
//   iconUrl: redPinImage,
//   shadowUrl: shadowImage,
//   iconSize: [20, 30],
//   shadowSize: [20, 10],
//   iconAnchor: [10, 32],
//   shadowAnchor: [4, 11],
//   popupAnchor: [0, -10],
// });

export function PropertyLayer({ properties }: { properties: PropertyProps[] }) {
  const { isDrawToolsVisible, isAreaFilterVisible } = useUIStore();

  const {
    // property: currentProperty,
    updateProperty,
    propertiesID,
  } = usePropertyStore();

  const [isFullscreen, setIsFullscreen] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  function handleCloseModal() {
    setModalVisible(false);
    updateProperty(null);
  }

  const propriedadesFiltradas = properties.filter((property) =>
    propertiesID.includes(property.id)
  );

  useEffect(() => {
    const mapElement = document.querySelector(".leaflet-container");

    if (mapElement) {
      const onFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
      };

      mapElement.addEventListener("fullscreenchange", onFullscreenChange);

      return () => {
        mapElement.removeEventListener("fullscreenchange", onFullscreenChange);
      };
    }
  }, []);

  Modal.setAppElement("#root");

  return (
    <>
      {propriedadesFiltradas.map((property) => {
        const position = JSON.parse(property.geojson).coordinates;

        return (
          <Marker
            interactive={!isDrawToolsVisible && !isAreaFilterVisible}
            key={`${property.id}-${isDrawToolsVisible}-${isAreaFilterVisible}`}
            position={[position[1], position[0]]}
            icon={customIcon}
            pmIgnore={true}
            eventHandlers={{
              mouseover: (e) => {
                e.target.openPopup();
              },
            }}
          >
            <Popup className="custom-popup">
              <div className={styles.customPopup}>
                <h3>{property.nome_propriedade}</h3>
                <div className={styles.infoContainer}>
                  <MapPin className={styles.icon} size={12} weight="fill" />
                  {property.comunidade}, {property.distrito}
                </div>
                {!isFullscreen && (
                  <button
                    className={styles.detailsButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      updateProperty(property);
                      setModalVisible(true);
                    }}
                  >
                    Vem Mais
                  </button>
                )}

                {
                  <div className={styles.propertiesSection}>
                    <div className={styles.iconsContainer}>
                      {property.agricultura && (
                        <Plant size={16} className={styles.icon} />
                      )}
                      {property.pecuaria && (
                        <Cow size={16} className={styles.icon} />
                      )}
                      {property.aquicultura && (
                        <Fish size={16} className={styles.icon} />
                      )}
                      {property.apicultura && (
                        <HiveOutlined sx={{ fontSize: 16, color: "#006400" }} />
                      )}
                      {property.artesanato && (
                        <HandCoins size={16} className={styles.icon} />
                      )}
                      {property.outras_atividades && (
                        <Plus size={16} className={styles.icon} />
                      )}
                    </div>
                    <div className={styles.areaContainer}>
                      <ArrowsOutSimple size={16} className={styles.icon} />
                      <div>{property.area}Km²</div>
                    </div>
                  </div>
                }
              </div>
            </Popup>
          </Marker>
        );
      })}
      {modalVisible && !isFullscreen && (
        <ModalPropertyInfo
          isOpen={modalVisible}
          onRequestClose={handleCloseModal}
        />
      )}
    </>
  );
}
