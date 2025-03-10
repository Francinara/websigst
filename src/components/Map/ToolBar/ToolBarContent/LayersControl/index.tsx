import { useEffect, useMemo, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

import styles from "./styles.module.scss";
import Select from "react-select";

import { StylesConfig } from "react-select";

const customStyles: StylesConfig = {
  control: (provided, state) => ({
    ...provided,
    boxShadow: "none",
    margin: "0px",
    width: "135px",
    height: "28px",
    minHeight: "10px",
    borderColor: "#fff",
    opacity: state.isDisabled ? 0.5 : 1,

    "&:hover": {
      borderColor: "#aaa",
    },
  }),
  menu: (provided) => ({
    ...provided,
    margin: "2px 0px",
  }),

  dropdownIndicator: (provided) => ({
    ...provided,
    padding: "0px 2px",
  }),

  indicatorSeparator: (provided) => ({
    ...provided,
    display: "none",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#78716c",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#78716c",
    fontWeight: "bold",
  }),
  option: (provided, state) => ({
    ...provided,
    display: "flex",
    alignItems: "center",
    backgroundColor: state.isFocused ? "#fafaf9" : "#fff",
    color: "#78716c",
  }),
};

export default function LayersControl() {
  const map = useMap();

  const [activeLayer, setActiveLayer] = useState<{
    value: L.TileLayer;
    label: string;
  }>();

  const osmLayer = useMemo<L.TileLayer>(
    () =>
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | UAST - UFRPE',
      }),
    []
  );

  const topoLayer = useMemo(
    () =>
      L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.opentopomap.org/copyright">OpenTopoMap</a> contributors | UAST - UFRPE',
      }),
    []
  );

  const googleStreetsLayer = useMemo(
    () =>
      L.tileLayer("http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}", {
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
        attribution: "Dados do mapa: Google, &copy2024 | UAST - UFRPE",
      }),
    []
  );

  const googleSatelliteLayer = useMemo(
    () =>
      L.tileLayer("http://{s}.google.com/vt?lyrs=s&x={x}&y={y}&z={z}", {
        subdomains: ["mt0", "mt1", "mt2", "mt3"],
        attribution: "Dados do mapa: Google, &copy2024 | UAST - UFRPE",
      }),
    []
  );

  const options = [
    { value: osmLayer, label: "OpenStreetMap" },
    { value: topoLayer, label: "OpenTopoMap" },
    { value: googleStreetsLayer, label: "Streets" },
    { value: googleSatelliteLayer, label: "Satellite" },
  ];

  const switchLayer = (layer: { value: L.TileLayer; label: string }) => {
    if (!map) return;
    if (activeLayer?.value) {
      map.removeLayer(activeLayer.value);
    }
    map.addLayer(layer.value);
    setActiveLayer(layer);
  };

  useEffect(() => {
    if (map && !activeLayer) {
      switchLayer(options[0]);
    }
  }, [map]);

  return (
    <>
      <div className={styles.select}>
        <Select
          isSearchable={false}
          isDisabled={false}
          options={options}
          value={activeLayer}
          classNamePrefix="scrollable"
          styles={customStyles}
          menuPlacement="top"
          onChange={(option) => {
            switchLayer(
              option as {
                value: L.TileLayer;
                label: string;
              }
            );
          }}
        />
      </div>
      <div className={styles.LayersControlContainer}>
        {options.map((option) => (
          <button
            key={option.label}
            className={`${styles.textButton} ${
              activeLayer?.value === option.value ? styles.activeTextButton : ""
            }`}
            disabled={activeLayer?.value === option.value}
            onClick={() => {
              switchLayer(option);
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
    </>
  );
}
