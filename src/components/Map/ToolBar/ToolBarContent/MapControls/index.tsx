import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import {
  CornersIn,
  CornersOut,
  MagnifyingGlassMinus,
  MagnifyingGlassPlus,
} from "@phosphor-icons/react";

import styles from "./styles.module.scss";
export default function MapControls() {
  const map = useMap(); // Acessa a instância do mapa do Leaflet

  const [isFullscreen, setIsFullscreen] = useState(false); // Estado para fullscreen
  const [isZoomInDisabled, setIsZoomInDisabled] = useState(false);
  const [isZoomOutDisabled, setIsZoomOutDisabled] = useState(false);

  // Função para ativar/desativar o modo fullscreen
  const toggleFullscreen = () => {
    if (map) {
      map.toggleFullscreen();
    }
  };

  // Atualiza o estado do botão de fullscreen
  useEffect(() => {
    if (!map) return;

    const handleFullscreenChange = () => {
      setIsFullscreen(map.isFullscreen());
    };

    // Escuta os eventos de entrada e saída do fullscreen
    map.on("fullscreenchange", handleFullscreenChange);

    // Cleanup do evento ao desmontar
    return () => {
      map.off("fullscreenchange", handleFullscreenChange);
    };
  }, [map]);

  useEffect(() => {
    if (!map) return;

    const updateZoomButtons = () => {
      const currentZoom = map.getZoom();
      const minZoom = map.getMinZoom();
      const maxZoom = map.getMaxZoom();

      setIsZoomInDisabled(currentZoom >= maxZoom);
      setIsZoomOutDisabled(currentZoom <= minZoom);
    };

    // Atualiza ao carregar o mapa e ao mudar o zoom
    updateZoomButtons();
    map.on("zoomend", updateZoomButtons);

    // Cleanup do evento ao desmontar
    return () => {
      map.off("zoomend", updateZoomButtons);
    };
  }, [map]);

  // Função para aplicar zoom
  const zoomIn = () => {
    if (map) {
      map.zoomIn();
    }
  };

  const zoomOut = () => {
    if (map) {
      map.zoomOut();
    }
  };
  return (
    <>
      <button
        data-tooltip-id="my-tooltip"
        data-tooltip-content="Zoom out"
        data-tooltip-place="top"
        className={`${styles.iconButton} ${
          isZoomOutDisabled ? styles.disabledIconButton : ""
        }`}
        onClick={zoomOut}
        disabled={isZoomOutDisabled}
      >
        <MagnifyingGlassMinus size={20} />
      </button>
      <button
        data-tooltip-id="my-tooltip"
        data-tooltip-content="Zoom in"
        data-tooltip-place="top"
        className={`${styles.iconButton} ${
          isZoomInDisabled ? styles.disabledIconButton : ""
        }`}
        onClick={zoomIn}
        disabled={isZoomInDisabled}
      >
        <MagnifyingGlassPlus size={20} />
      </button>
      <button
        data-tooltip-id="my-tooltip"
        data-tooltip-content={
          isFullscreen ? "Exit Fullscreen" : "View Fullscreen"
        }
        data-tooltip-place="top"
        className={styles.iconButton}
        onClick={toggleFullscreen}
      >
        {isFullscreen ? <CornersIn size={20} /> : <CornersOut size={20} />}
      </button>
    </>
  );
}
