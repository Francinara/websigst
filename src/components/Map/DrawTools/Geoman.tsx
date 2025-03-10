import { useEffect } from "react";
import { useLeafletContext } from "@react-leaflet/core";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import L from "leaflet";
import "../MapStyles.scss";

import bluPinImage from "../../../assets/blue_pin.png";
import shadowImage from "../../../assets/shadow.png";
import { useDownloadStore } from "../../../store/useDownloadStore";
import { useUIStore } from "../../../store/useUIStore";

const customIcon = L.icon({
  iconUrl: bluPinImage,
  shadowUrl: shadowImage,
  iconSize: [20, 30],
  shadowSize: [20, 10],
  iconAnchor: [10, 32],
  shadowAnchor: [4, 11],
  popupAnchor: [0, -32],
});

export default function Geoman() {
  const context = useLeafletContext();
  const { isDrawToolsVisible, updateIsDrawToolsVisible } = useUIStore();
  const { addDrawnItem, removeDrawnItem, resetDrawItem, editDrawnItem } =
    useDownloadStore();

  useEffect(() => {
    return () => {
      resetDrawItem();
      updateIsDrawToolsVisible(false);
    };
  }, []);

  useEffect(() => {
    const map = (context.layerContainer || context.map) as L.Map;

    if (isDrawToolsVisible) {
      map.pm.addControls({
        position: "topleft",
        drawText: false,
        drawMarker: false,
        drawCircleMarker: true,
        customControl: true,
        cutPolygon: true,
      });

      map.eachLayer((layer) => {
        if (layer.pm) {
          layer.pm.enable();
        }
      });

      if (!map.pm.Toolbar.getControlOrder().includes("customMarker")) {
        const customMarker = map.pm.Toolbar.copyDrawControl("drawMarker", {
          name: "customMarker",
        });
        customMarker.drawInstance.setOptions({
          markerStyle: { icon: customIcon },
        });
      }
      map.pm.setGlobalOptions({
        pmIgnore: false,
      } as L.PM.GlobalOptions & { pmIgnore?: boolean });

      map.on("pm:create", (e) => {
        if (e.layer && e.layer.pm) {
          const createdLayer = e.layer;
          const geojson = createdLayer.toGeoJSON();

          if (createdLayer instanceof L.Circle && geojson.properties) {
            geojson.properties.radius = createdLayer.getRadius();
          }

          addDrawnItem({ id: createdLayer._leaflet_id, feature: geojson });

          const shape = e;
          shape.layer.pm.enable();

          shape.layer.on("pm:edit", (e) => {
            const editedLayer = e.layer;
            const editedGeojson = editedLayer.toGeoJSON();

            if (editedLayer instanceof L.Circle && editedGeojson.properties) {
              editedGeojson.properties.radius = editedLayer.getRadius();
            }

            editDrawnItem(editedLayer._leaflet_id, editedGeojson);
          });
        }
      });

      map.on("pm:cut", (e) => {
        const originalLayer = e.originalLayer;
        const newLayers = e.layer as L.Layer | L.LayerGroup;

        removeDrawnItem(originalLayer._leaflet_id);
        if ((newLayers as L.LayerGroup).eachLayer) {
          (newLayers as L.LayerGroup).eachLayer((layer: L.Layer) => {
            const newGeoJSON = layer.toGeoJSON();
            addDrawnItem({ id: layer._leaflet_id, feature: newGeoJSON });
          });
        } else {
          const geojson = (newLayers as L.Layer).toGeoJSON();
          addDrawnItem({
            id: (newLayers as L.Layer)._leaflet_id,
            feature: geojson,
          });
        }
      });

      map.on("pm:remove", (e) => {
        const removedLayer = e.layer;

        removeDrawnItem(removedLayer._leaflet_id);
      });

      return () => {
        map.pm.removeControls();
        map.pm.setGlobalOptions({
          pmIgnore: true,
        } as L.PM.GlobalOptions & { pmIgnore?: boolean });
      };
    } else {
      map.pm.removeControls();

      if (map.pm.globalDragModeEnabled()) {
        map.pm.disableGlobalDragMode();
      }
      if (map.pm.globalEditModeEnabled()) {
        map.pm.disableGlobalEditMode();
      }
      if (map.pm.globalCutModeEnabled()) {
        map.pm.disableGlobalCutMode();
      }
      if (map.pm.globalRemovalModeEnabled()) {
        map.pm.disableGlobalRemovalMode();
      }
      if (map.pm.globalRotateModeEnabled()) {
        map.pm.disableGlobalRotateMode();
      }
      if (map.pm.globalDrawModeEnabled()) {
        map.pm.disableDraw();
      }

      map.eachLayer((layer) => {
        if (layer.pm && layer.pm.enabled()) {
          layer.pm.disable();
        }
      });
    }
  }, [
    isDrawToolsVisible,
    context,
    addDrawnItem,
    removeDrawnItem,
    editDrawnItem,
  ]);

  return null;
}
