import * as L from "leaflet";

declare module "leaflet" {
  export function heatLayer(
    latlngs: L.LatLngExpression[],
    options?: L.HeatMapOptions
  ): L.Layer;
}

declare namespace L {
  interface HeatMapOptions {
    radius?: number;
    blur?: number;
    maxZoom?: number;
    gradient?: { [key: number]: string };
    minOpacity?: number;
  }
}
