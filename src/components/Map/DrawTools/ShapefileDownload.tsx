import { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import "leaflet-fullscreen";
import "leaflet.heat";
import L from "leaflet";

import "leaflet-draw/dist/leaflet.draw.css";

import shpwrite from "@mapbox/shp-write";
import { FeatureCollection, MultiPolygon, Polygon, Feature } from "geojson";
import save from "save-file";
import JSZip from "jszip";

import { DownloadSimple } from "@phosphor-icons/react";

import ReactDOM from "react-dom";

import styles from "./styles.module.scss";
import {
  DrawnItemsProps,
  useDownloadStore,
} from "../../../store/useDownloadStore";

export function ShapefileDownload() {
  const map = useMap();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerDiv, setContainerDiv] = useState<HTMLDivElement | null>(null);
  const { drawnItems } = useDownloadStore();

  useEffect(() => {
    const CustomControl = L.Control.extend({
      onAdd: function () {
        const div = L.DomUtil.create("div", "shapefile-download");
        containerRef.current = div;
        L.DomEvent.disableClickPropagation(div);
        L.DomEvent.disableScrollPropagation(div);
        setContainerDiv(div);
        return div;
      },
      onRemove: function () {},
    });

    const customControl = new CustomControl({ position: "topleft" });
    customControl.addTo(map);

    return () => {
      map.removeControl(customControl);
    };
  }, [map]);

  const convertMultiPolygonToPolygons = (
    multiPolygons: DrawnItemsProps[]
  ): Feature<Polygon>[] => {
    return multiPolygons.flatMap((multiPolygon) =>
      (multiPolygon.feature.geometry as MultiPolygon).coordinates.map(
        (polygonCoords: number[][][]) => ({
          ...multiPolygon.feature,
          geometry: {
            type: "Polygon",
            coordinates: polygonCoords,
          },
        })
      )
    );
  };

  async function handleDownload() {
    const lineString = drawnItems
      .filter((item) => item.feature.geometry.type === "LineString")
      .map((itens) => itens.feature);
    const multiLineString = drawnItems
      .filter((item) => item.feature.geometry.type === "MultiLineString")
      .map((itens) => itens.feature);
    const polygon = drawnItems
      .filter((item) => item.feature.geometry.type === "Polygon")
      .map((itens) => itens.feature);
    const multiPolygon = convertMultiPolygonToPolygons(
      drawnItems.filter((item) => item.feature.geometry.type === "MultiPolygon")
    );

    const combinedPolygons = [...polygon, ...multiPolygon];
    const point = drawnItems
      .filter(
        (item) =>
          item.feature.geometry.type === "Point" &&
          !item.feature.properties?.radius
      )
      .map((itens) => itens.feature);
    const circle = drawnItems
      .filter(
        (item) =>
          item.feature.geometry.type === "Point" &&
          item.feature.properties?.radius
      )
      .map((itens) => itens.feature);
    const multiPoint = drawnItems
      .filter((item) => item.feature.geometry.type === "MultiPoint")
      .map((itens) => itens.feature);
    const geometryCollection = drawnItems
      .filter((item) => item.feature.geometry.type === "GeometryCollection")
      .map((itens) => itens.feature);

    const zip = new JSZip();

    const geometries = [
      { type: "line_string", features: lineString },
      { type: "multi_line_string", features: multiLineString },
      { type: "polygon", features: combinedPolygons },
      { type: "point", features: point },
      { type: "circle", features: circle },
      { type: "multiPoint", features: multiPoint },
      { type: "geometryCollection", features: geometryCollection },
    ];

    for (const { type, features } of geometries) {
      if (features.length > 0) {
        const geojsonFeatureCollection: FeatureCollection = {
          type: "FeatureCollection",
          features: features,
        };
        const geometryZip = (await shpwrite.zip(
          geojsonFeatureCollection
        )) as Uint8Array;
        zip.file(`${type}.zip`, geometryZip, { base64: true });
      }
    }

    if (Object.keys(zip.files).length > 1) {
      const combinedZip = await zip.generateAsync({ type: "blob" });
      await save(combinedZip, "geometries.zip");
    } else if (Object.keys(zip.files).length === 1) {
      const singleFile = await zip.files[Object.keys(zip.files)[0]].async(
        "blob"
      );
      await save(singleFile, Object.keys(zip.files)[0]);
    }
  }

  const isDisabled = drawnItems.length < 1;

  return containerDiv
    ? ReactDOM.createPortal(
        <button
          className={`${styles.button} ${isDisabled ? styles.disabled : ""}`}
          onClick={handleDownload}
          disabled={isDisabled}
        >
          <DownloadSimple size={20} weight="bold" />
        </button>,
        containerDiv
      )
    : null;
}
