declare module "leaflet-fullscreen" {
  import * as L from "leaflet";

  module "leaflet" {
    namespace control {
      interface FullscreenOptions {
        position?: string;
        title?: string;
        titleCancel?: string;
        forceSeparateButton?: boolean;
        forcePseudoFullscreen?: boolean;
        fullscreenElement?: HTMLElement;
      }

      function fullscreen(options?: FullscreenOptions): Control;
    }
  }

  export default L;
}
