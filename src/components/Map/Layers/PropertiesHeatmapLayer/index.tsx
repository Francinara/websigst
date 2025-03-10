import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { interpolateViridis, scaleSequential } from "d3";

interface HeatmapLayerProps {
  points: [number, number][];
}

export function PropertiesHeatmapLayer({ points }: HeatmapLayerProps) {
  const map = useMap();

  const colorScale = scaleSequential(interpolateViridis).domain([0, 1]);

  useEffect(() => {
    if (!map) return;

    const layerGroup = L.layerGroup();

    const heat = L.heatLayer(points, {
      radius: 30,
      gradient: {
        0.1: colorScale(0.1),
        0.2: colorScale(0.2),
        0.3: colorScale(0.3),
        0.4: colorScale(0.4),
        0.5: colorScale(0.5),
        0.6: colorScale(0.6),
        0.7: colorScale(0.7),
        0.8: colorScale(0.8),
        0.9: colorScale(0.9),
        1.0: colorScale(1.0),
      },
      pmIgnore: true,
    });

    layerGroup.addLayer(heat);
    layerGroup.addTo(map);

    return () => {
      map.removeLayer(layerGroup as L.Layer);
    };
  }, [map, points, colorScale]);

  return null;
}
