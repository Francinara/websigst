import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

import "./styles.scss";
import { useLegendStore } from "../../../../store/useLegendStore";
import { useDistrictStore } from "../../../../store/useDistrictStore";
import { useUIStore } from "../../../../store/useUIStore";
import { useDistricts } from "../../../../hooks/useDistricts";

interface DistrictLayerProps {
  color: string;
  fillOpacity?: number;
}

export function DistrictLayer({
  color,
  fillOpacity = 0.0,
}: DistrictLayerProps) {
  const map = useMap();

  const { isDrawToolsVisible, isAreaFilterVisible } = useUIStore();

  const { district: districtFilter, updateDistrict } = useDistrictStore();

  const { data: districts } = useDistricts();

  const legend = useLegendStore();

  const layerGroup = L.layerGroup();

  useEffect(() => {
    const savedDistrict = localStorage.getItem("selectedDistrict");
    if (savedDistrict) {
      const district = districts?.find(
        (d) => d.id === JSON.parse(savedDistrict).id
      );
      if (district) {
        updateDistrict(district);
      }
    }
  }, [districts, updateDistrict]);

  useEffect(() => {
    const style = {
      color: color,
      weight: 2,
      opacity: 0.6,
      fillColor: color,
      fillOpacity: fillOpacity,
    };

    const hoverStyle = {
      fillColor: color,
      fillOpacity: 0.04,
    };

    const selectStyle = {
      fillOpacity: 0.07,
      color: color,
    };

    districts?.forEach((district) => {
      try {
        const geojsonData = JSON.parse(district.geojson);
        const geoJsonLayer = L.geoJSON(geojsonData, {
          style: () =>
            district === districtFilter &&
            (legend.propertyVisible || legend.propertyDensityVisible)
              ? selectStyle
              : style,
          onEachFeature: (_feature, layer) => {
            layer.on({
              click: () => {
                if (
                  isDrawToolsVisible ||
                  isAreaFilterVisible ||
                  (!legend.propertyVisible && !legend.propertyDensityVisible)
                ) {
                  return;
                } else {
                  const currentDistrict = useDistrictStore.getState().district;
                  const same = currentDistrict?.id === district.id;
                  const newDistrict = same ? null : district;

                  if (newDistrict) {
                    localStorage.setItem(
                      "selectedDistrict",
                      JSON.stringify(newDistrict)
                    );
                  } else {
                    localStorage.removeItem("selectedDistrict");
                  }

                  updateDistrict(newDistrict);
                }
              },
              mouseover: () => {
                if (
                  isDrawToolsVisible ||
                  isAreaFilterVisible ||
                  (!legend.propertyVisible && !legend.propertyDensityVisible)
                ) {
                  return;
                } else {
                  layer.setStyle(hoverStyle);
                }
              },
              mouseout: () => {
                layer.setStyle(
                  district === districtFilter &&
                    (legend.propertyVisible || legend.propertyDensityVisible)
                    ? selectStyle
                    : style
                );
                map.closePopup();
              },
            });
            if (isDrawToolsVisible || isAreaFilterVisible) {
              return;
            } else {
              layer.bindTooltip(district.NM_DIST, {
                direction: "center",
                offset: [0, -10],
                permanent: false,
              });
            }
          },
          pmIgnore: true,
        });
        layerGroup.addLayer(geoJsonLayer as L.Layer);
      } catch (error) {
        console.error(`Erro ao processar o geojson de ${district.id}:`, error);
      }
    });

    layerGroup.addTo(map);

    layerGroup.eachLayer((layer) => {
      if (isDrawToolsVisible) {
        layer.bringToBack();
      } else {
        layer.bringToFront();
      }
    });

    return () => {
      layerGroup.removeFrom(map);
    };
  }, [
    isDrawToolsVisible,
    isAreaFilterVisible,
    map,
    districts,
    color,
    fillOpacity,
    districtFilter,
    updateDistrict,
    layerGroup,
    legend,
  ]);

  // useEffect(() => {
  //   if (districtFilter) {
  //     try {
  //       const geojsonData = JSON.parse(districtFilter.geojson);
  //       const geoJsonLayer = L.geoJSON(geojsonData);
  //       const bounds = geoJsonLayer.getBounds();
  //       map.fitBounds(bounds, { padding: [50, 50] });
  //     } catch (error) {
  //       console.error("Erro ao calcular os limites do distrito:", error);
  //     }
  //   } else {
  //     map.setView([-8.072111864818805, -38.38523229242289], 10);
  //   }
  // }, [districtFilter, map]);

  return null;
}
