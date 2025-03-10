import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import redPinImage from "../../../assets/red_pin.png";
import shadowImage from "../../../assets/shadow.png";

interface ShapefileProps {
  data: GeoJSON.FeatureCollection;
}

export default function Shapefile({ data }: ShapefileProps) {
  const map = useMap();
  const layerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!data || !map) return;

    if (layerRef.current) {
      map.removeLayer(layerRef.current as L.Layer);
    }

    const customIcon = new L.Icon({
      iconUrl: redPinImage,
      shadowUrl: shadowImage,
      iconSize: [20, 30],
      shadowSize: [20, 10],
      iconAnchor: [10, 32],
      shadowAnchor: [4, 11],
      popupAnchor: [0, -32],
    });

    const geo = L.geoJson(data, {
      pointToLayer: function (feature, latlng) {
        if (feature.properties?.radius) {
          const radius = feature.properties.radius || 100;
          return L.circle(latlng, { radius, pmIgnore: true });
        }
        return L.marker(latlng, { icon: customIcon, pmIgnore: true });
      },
      style: function (feature) {
        return {
          color: feature?.properties?.lineColor || "red",
          fillColor: feature?.properties?.fillColor || "red",
          fillOpacity: 0.5,
          weight: 2,
        };
      },
      // onEachFeature: function popUp(f, l) {
      //   const properties = { ...f.properties };
      //   delete properties.radius;
      //   if (properties && Object.keys(properties).length > 0) {
      //     const out = [];
      //     for (const key in properties) {
      //       out.push(key + ": " + properties[key]);
      //     }
      //     l.bindPopup(out.join("<br />"));
      //   }
      // },
      pmIgnore: true,
    }).addTo(map);

    layerRef.current = geo;

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current as L.Layer);
      }
    };
  }, [map, data]);

  return null;
}
