import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { useWater } from "../../../../hooks/useWater";

interface WaterLayerProps {
  color: string;
  fillOpacity?: number;
}

export function WaterLayer({ color, fillOpacity = 0.2 }: WaterLayerProps) {
  const map = useMap();
  const layerGroup = L.layerGroup();
  const { data: waters } = useWater();

  useEffect(() => {
    const style = {
      color: color,
      weight: 2,
      opacity: 0,
      fillColor: color,
      fillOpacity: fillOpacity,
    };

    waters?.forEach((water) => {
      try {
        const geojsonData = JSON.parse(water.geojson);
        const geoJsonLayer = L.geoJSON(geojsonData, { style });
        layerGroup.addLayer(geoJsonLayer as L.Layer);
      } catch (error) {
        console.error(`Erro ao processar o geojson de ${water.id}:`, error);
      }
    });

    layerGroup.addTo(map);

    return () => {
      layerGroup.removeFrom(map);
    };
  }, [map, waters, color, fillOpacity, layerGroup]);

  return null;
}
