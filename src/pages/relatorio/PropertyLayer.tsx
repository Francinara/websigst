import { Marker } from "react-leaflet";
import L from "leaflet";
import greenPinImage from "../../assets/green_pin.png";
import redPinImage from "../../assets/red_pin.png";
import shadowImage from "../../assets/shadow.png";
import Modal from "react-modal";

import { PropertyProps } from "../../contexts/MapContext/types";
import { usePropertyStore } from "../../store/usePropertyStore";
import { useUIStore } from "../../store/useUIStore";

const customIcon = new L.Icon({
  iconUrl: greenPinImage,
  shadowUrl: shadowImage,
  iconSize: [20, 30],
  shadowSize: [20, 10],
  iconAnchor: [10, 32],
  shadowAnchor: [4, 11],
  popupAnchor: [0, -10],
});
const customIconRed = new L.Icon({
  iconUrl: redPinImage,
  shadowUrl: shadowImage,
  iconSize: [20, 30],
  shadowSize: [20, 10],
  iconAnchor: [10, 32],
  shadowAnchor: [4, 11],
  popupAnchor: [0, -10],
});

export function PropertyLayer({ properties }: { properties: PropertyProps[] }) {
  const { isDrawToolsVisible, isAreaFilterVisible } = useUIStore();

  const { property: currentProperty } = usePropertyStore();

  Modal.setAppElement("#root");

  return (
    <>
      {properties.map((property) => {
        const position = JSON.parse(property.geojson).coordinates;

        return (
          <Marker
            key={property.id}
            position={[position[1], position[0]]}
            icon={
              currentProperty?.id === property.id ? customIconRed : customIcon
            }
            pmIgnore={true}
            interactive={false}
            eventHandlers={{
              mouseover: (e) => {
                if (isDrawToolsVisible || isAreaFilterVisible) {
                  return;
                } else {
                  e.target.openPopup();
                }
              },
            }}
          ></Marker>
        );
      })}
    </>
  );
}
