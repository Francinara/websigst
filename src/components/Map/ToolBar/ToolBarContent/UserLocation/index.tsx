import { useEffect, useState } from "react";
import { Marker, useMap } from "react-leaflet";
import userLocalIcon from "../../../../../assets/userLocal.png";
import L from "leaflet";
import { GpsFix } from "@phosphor-icons/react";

import styles from "./styles.module.scss";

const userLocationIcon = new L.Icon({
  iconUrl: userLocalIcon,
  iconSize: [30, 30],
  iconAnchor: [10, 32],
  popupAnchor: [0, -10],
});

export default function UserLocation() {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [hasLocationAccess, setHasLocationAccess] = useState(true);

  const map = useMap();

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocalização não é suportada pelo navegador.");
      setHasLocationAccess(false);
      return;
    }

    const success = (pos: GeolocationPosition) => {
      const { latitude, longitude } = pos.coords;
      setPosition([latitude, longitude]);
    };

    const error = (err: GeolocationPositionError) => {
      console.error("Erro ao obter localização: ", err.message);
      setHasLocationAccess(false);
    };

    navigator.geolocation.getCurrentPosition(success, error);
  }, []);

  const handleGoToLocation = () => {
    if (position) {
      map.setView(position, 12, { animate: true });
    }
  };

  return (
    <>
      {position && (
        <Marker position={position} icon={userLocationIcon} pmIgnore={true} />
      )}

      <button
        data-tooltip-id="my-tooltip"
        data-tooltip-content={
          hasLocationAccess
            ? "Ir para minha localização"
            : "Localização indisponível"
        }
        data-tooltip-place="top"
        disabled={!hasLocationAccess || !position}
        onClick={handleGoToLocation}
        className={`${styles.iconButton} ${
          !hasLocationAccess ? styles.disabledIconButton : ""
        }`}
      >
        <GpsFix size={20} />
      </button>
    </>
  );
}
