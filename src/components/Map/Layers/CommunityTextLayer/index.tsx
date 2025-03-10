import { useMapEvents } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";

import "./styles.scss";
import { useCommunities } from "../../../../hooks/useCommunities";

export function CommunityTextLayer({ color }: { color: string }) {
  const { data: communities } = useCommunities();

  const [zoom, setZoom] = useState<number>(8);

  const map = useMapEvents({
    moveend() {
      setZoom(map.getZoom());
    },
    zoomend() {
      setZoom(map.getZoom());
    },
  });

  useEffect(() => {
    if (map) {
      setZoom(map.getZoom());
    }
  }, [map]);

  useEffect(() => {
    if (!map || zoom <= 10) return;

    const layerGroup = L.layerGroup();

    communities?.forEach((community) => {
      const coordinates = JSON.parse(community.geojson).coordinates[0];
      const invertedCoordinates: [number, number] = [
        coordinates[1],
        coordinates[0],
      ];

      const tooltip = L.tooltip({
        className: "text-tooltip",
        direction: "top",
        permanent: true,
        offset: [0, 0],
        opacity: 1,
      }).setContent(
        `<div style="color: ${color}; font-size: 10px; font-weight: 600; font-family: Roboto; text-align: center;">${community.nome}</div>`
      );

      L.circleMarker(invertedCoordinates, {
        radius: 0,
        color: "transparent",
        pmIgnore: true,
      })
        .bindTooltip(tooltip)
        .addTo(layerGroup);
    });

    layerGroup.addTo(map);

    return () => {
      layerGroup.remove();
    };
  }, [map, communities, zoom, color]);

  return null;
}
