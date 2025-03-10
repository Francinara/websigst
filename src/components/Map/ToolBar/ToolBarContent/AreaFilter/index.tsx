import {
  CaretDoubleDown,
  CursorClick,
  Funnel,
  Trash,
} from "@phosphor-icons/react";
import styles from "./style.module.scss";
import { useEffect, useState } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { useAreaFilter } from "../../../../../store/useAreaFilter";
import { useLegendStore } from "../../../../../store/useLegendStore";
import { useUIStore } from "../../../../../store/useUIStore";

function MouseSelectCircle({ radius }: { radius: number }) {
  const map = useMap();
  const [circle, setCircle] = useState<L.Circle | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: L.LeafletMouseEvent) => {
      const { latlng } = e;

      if (circle) {
        circle.setLatLng(latlng);
      } else {
        const newCircle = L.circle(latlng, {
          color: "#006400",
          weight: 1,
          opacity: 1,
          fillColor: "transparent",
          fillOpacity: 0.5,
          radius: radius * 1000,
          pmIgnore: true,
        }).addTo(map);
        setCircle(newCircle);
      }
    };

    map.on("mousemove", handleMouseMove);

    return () => {
      map.off("mousemove", handleMouseMove);
      if (circle) {
        map.removeLayer(circle);
      }
    };
  }, [map, circle]);

  useEffect(() => {
    if (circle) {
      circle.setRadius(radius * 1000);
    }
  }, [radius, circle]);

  return null;
}

function CenterCircle({
  radius,
  lat,
  lng,
}: {
  radius: number;
  lat: number;
  lng: number;
}) {
  const map = useMap();

  const [circle, setCircle] = useState<L.Circle | null>(null);

  useEffect(() => {
    if (circle) {
      map.removeLayer(circle);
    }
    if (
      lat != (0 || undefined) &&
      lng != (0 || undefined) &&
      radius != (0 || undefined)
    ) {
      const newCircle = L.circle([lat, lng], {
        color: "red",
        weight: 1,
        opacity: 1,
        fillColor: "transparent",
        fillOpacity: 0.5,
        radius: radius * 1000,
        pmIgnore: true,
      }).addTo(map);
      setCircle(newCircle);

      return () => {
        if (circle) {
          map.removeLayer(circle);
        }
      };
    }
  }, [map, lat, lng, radius]);

  useEffect(() => {
    if (circle) {
      circle.setRadius(radius * 1000);
      circle.setLatLng([lat, lng]);
    }
  }, [radius, lat, lng, circle]);

  return null;
}

export default function AreaFilter() {
  const { isDrawToolsVisible, isAreaFilterVisible, updateIsAreaFilterVisible } =
    useUIStore();

  const legend = useLegendStore();

  const areaFilter = useAreaFilter();

  const [lat, setLat] = useState(areaFilter.lat);
  const [lng, setLng] = useState(areaFilter.lng);
  const [radius, setRadius] = useState(areaFilter.radius);

  const [isSelection, setIsSelection] = useState(false);
  const [ignoreEffect, setIgnoreEffect] = useState(false);

  const isFilterCleaner =
    areaFilter.radius === 10 && areaFilter.lat === 0 && areaFilter.lng === 0;

  useMapEvents({
    click(e: L.LeafletMouseEvent) {
      if (isAreaFilterVisible) {
        if (isSelection) {
          const { latlng } = e;
          setLat(latlng.lat);
          setLng(latlng.lng);

          areaFilter.updateAreaFilter(radius, latlng.lat, latlng.lng);
        }
      }
    },
  });

  function handleAreaFilter() {
    areaFilter.updateAreaFilter(radius, lat, lng);
  }

  function handleCloseButton(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    updateIsAreaFilterVisible(false);
    setIsSelection(false);
  }

  useEffect(() => {
    updateIsAreaFilterVisible(false);
    setIsSelection(false);
  }, [isDrawToolsVisible]);

  function handleCleanerButton(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    areaFilter.updateAreaFilter(10, 0, 0);
    setLat(0);
    setLng(0);
    setRadius(10);
  }

  useEffect(() => {
    if (ignoreEffect) {
      areaFilter.updateAreaFilter(10, 0, 0);
      setIgnoreEffect(false);
      return;
    }
  }, [lat, lng, radius]);

  return (
    <>
      <button
        data-tooltip-id="my-tooltip"
        data-tooltip-content="Area Filter"
        data-tooltip-place="top"
        className={`${styles.iconButton} ${
          (legend.propertyVisible || legend.propertyDensityVisible) &&
          !isDrawToolsVisible
            ? isAreaFilterVisible
              ? styles.isActive
              : ""
            : styles.disabledIconButton
        }`}
        onClick={() => updateIsAreaFilterVisible(!isAreaFilterVisible)}
        disabled={
          (!legend.propertyVisible && !legend.propertyDensityVisible) ||
          isDrawToolsVisible
        }
      >
        <Funnel size={20} />
      </button>
      {isSelection && <MouseSelectCircle radius={radius} />}
      <CenterCircle radius={radius} lat={lat} lng={lng} />

      {isAreaFilterVisible && (
        <div className={styles.container}>
          <div className={styles.header}>
            <h3>Area filter</h3>
            <div className={styles.buttonContainer}>
              <button
                data-tooltip-id="my-tooltip"
                data-tooltip-content="Limpar filtro"
                data-tooltip-place="top"
                onClick={handleCleanerButton}
                disabled={isFilterCleaner}
              >
                <Trash size={14} weight="bold" />
              </button>
              <button
                data-tooltip-id="my-tooltip"
                data-tooltip-content="Fechar"
                data-tooltip-place="top"
                onClick={handleCloseButton}
              >
                <CaretDoubleDown size={14} weight="bold" />
              </button>
            </div>
          </div>
          <div className={styles.coordContainer}>
            <button
              onClick={() => setIsSelection(!isSelection)}
              className={`${styles.filterButton} ${
                isSelection ? styles.isActive : ""
              }`}
            >
              <CursorClick size={16} weight="bold" />
            </button>
            <div className={styles.inputContainer}>
              <div>Lat:</div>
              <input
                type="number"
                value={lat}
                onChange={(e) => {
                  setIgnoreEffect(true);
                  setLat(Number(e.target.value));
                }}
                disabled={isSelection}
              />
            </div>
            <div className={styles.inputContainer}>
              <div>Lng:</div>
              <input
                type="number"
                value={lng}
                onChange={(e) => {
                  setIgnoreEffect(true);
                  setLng(Number(e.target.value));
                }}
                disabled={isSelection}
              />
            </div>
          </div>
          <div className={styles.radioInputContainer}>
            <div>Raio: </div>
            <input
              type="number"
              value={radius}
              onChange={(e) => {
                setIgnoreEffect(true);
                setRadius(Math.max(0, Number(e.target.value)));
              }}
            />
            <span>Km</span>
            <button
              data-tooltip-id="my-tooltip"
              data-tooltip-content="Filtra"
              data-tooltip-place="top"
              disabled={lat === 0 || lng === 0 || radius === 0}
              onClick={handleAreaFilter}
            >
              Filtrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
