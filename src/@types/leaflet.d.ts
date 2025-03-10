declare module "leaflet" {
  interface Layer {
    toGeoJSON(): GeoJSON.Feature;
    setStyle(style: PathOptions): this;
    bringToBack(): this;
    bringToFront(): this;
  }

  export function latLng(lat: number, lng: number): L.LatLng;

  export interface LatLng {
    lat: number;
    lng: number;
    distanceTo(other: LatLng): number;
  }

  export function marker(
    latlng: LatLngExpression,
    options?: MarkerOptions
  ): L.Marker;

  export interface MarkerOptions {
    icon?: Icon;
    draggable?: boolean;
  }

  export interface Marker {
    addTo(map: Map): this;
    setLatLng(latlng: LatLngExpression): this;
  }

  interface Layer {
    pm: PM.LayerPM; // Propriedade adicionada pelo Leaflet-Geoman
    _leaflet_id: number; // Propriedade interna do Leaflet
  }

  // Estender Circle para incluir pm e _leaflet_id
  interface Circle<>extends Layer {
    getRadius(): number;
  }

  // Estender LayerGroup para incluir eachLayer
  interface LayerGroup {
    eachLayer(fn: (layer: Layer) => void): this;
  }

  // Definir a interface PM para Leaflet-Geoman
  namespace PM {
    interface LayerPM {
      enable(): void;
      disable(): void;
      enabled(): boolean;
    }

    interface Toolbar {
      copyDrawControl(
        name: string,
        options: { name: string }
      ): { drawInstance: DrawControl };
      getControlOrder(): string[];
    }

    interface DrawControl {
      setOptions(options: { markerStyle?: { icon: L.Icon } }): void;
    }

    interface GlobalOptions {
      pmIgnore?: boolean;
    }
  }

  // Estender Map para incluir métodos do Leaflet-Geoman
  interface Map {
    pm: {
      addControls(options: {
        position?: string;
        drawText?: boolean;
        drawMarker?: boolean;
        drawCircleMarker?: boolean;
        customControl?: boolean;
        cutPolygon?: boolean;
      }): void;
      removeControls(): void;
      setGlobalOptions(
        options: L.PM.GlobalOptions & { pmIgnore?: boolean }
      ): void;
      Toolbar: PM.Toolbar;
      enableDraw(): void;
      disableDraw(): void;
      globalDragModeEnabled(): boolean;
      globalEditModeEnabled(): boolean;
      globalCutModeEnabled(): boolean;
      globalRemovalModeEnabled(): boolean;
      globalRotateModeEnabled(): boolean;
      globalDrawModeEnabled(): boolean;
      disableGlobalDragMode(): void;
      disableGlobalEditMode(): void;
      disableGlobalCutMode(): void;
      disableGlobalRemovalMode(): void;
      disableGlobalRotateMode(): void;
    };
  }
}

export function map(element: string | HTMLElement, options?: MapOptions): L.Map;

export interface MapOptions {
  center?: LatLngExpression;
  zoom?: number;
}

export interface Map {
  setView(center: LatLngExpression, zoom: number): this;
  addLayer(layer: Layer): this;
  eachLayer(callback: (layer: Layer) => void): this;
  removeControl(control: Control): this;
}

export type LatLngExpression = LatLng | [number, number];
