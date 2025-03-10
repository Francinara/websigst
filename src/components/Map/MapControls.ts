import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import { useUIStore } from "../../store/useUIStore";

export default function MapControls() {
  const controlContainerRefTop = useRef<HTMLElement | null>(null);
  const controlContainerRefTable = useRef<HTMLElement | null>(null);
  const controlContainerRefBottomRight = useRef<HTMLElement | null>(null);
  const controlContainerRefTopRight = useRef<HTMLElement | null>(null);
  const controlContainerRefBottomLeft = useRef<HTMLElement | null>(null);
  const controlContainerRefLegend = useRef<HTMLElement | null>(null);
  const controlContainerRefMenu = useRef<HTMLElement | null>(null);
  const controlContainerRefFilter = useRef<HTMLElement | null>(null);
  const controlContainerRefToolBar = useRef<HTMLElement | null>(null);
  const controlContainerRefPMDraw = useRef<HTMLElement | null>(null);
  const controlContainerRefPMEdit = useRef<HTMLElement | null>(null);
  const controlContainerRefShapefileDownload = useRef<HTMLElement | null>(null);

  const map = useMap();

  const { isTableVisible, isDrawToolsVisible, isSidebarVisible } = useUIStore();

  useEffect(() => {
    if (map) {
      controlContainerRefTop.current = map
        .getContainer()
        .querySelector(".custom-menu");
      controlContainerRefTable.current = map
        .getContainer()
        .querySelector(".custom-table");
      controlContainerRefFilter.current = map
        .getContainer()
        .querySelector(".custom-filters");
      controlContainerRefToolBar.current = map
        .getContainer()
        .querySelector(".tool-bar-content");
      controlContainerRefPMDraw.current = map
        .getContainer()
        .querySelector(".leaflet-pm-draw");
      controlContainerRefPMEdit.current = map
        .getContainer()
        .querySelector(".leaflet-pm-edit");
      controlContainerRefShapefileDownload.current = map
        .getContainer()
        .querySelector(".shapefile-download");
    }
    if (map) {
      controlContainerRefTopRight.current = map
        .getContainer()
        .querySelector(".leaflet-top.leaflet-right");
    }
  }, [isSidebarVisible, isDrawToolsVisible, map]);

  useEffect(() => {
    if (map) {
      controlContainerRefBottomRight.current = map
        .getContainer()
        .querySelector(".leaflet-bottom.leaflet-right");
    }
    if (map) {
      controlContainerRefBottomLeft.current = map
        .getContainer()
        .querySelector(".tool-bar-content");
    }
    if (map) {
      controlContainerRefLegend.current = map
        .getContainer()
        .querySelector(".custom-legend");
    }
    if (map) {
      controlContainerRefMenu.current = map
        .getContainer()
        .querySelector(".custom-menu");
    }
  }, [isTableVisible, map]);

  useEffect(() => {
    const applySidebarClass = () => {
      const controlContainerTop = controlContainerRefTop.current;
      const controlContainerTable = controlContainerRefTable.current;

      const controlContainerFilter = controlContainerRefFilter.current;
      const controlContainerToolBar = controlContainerRefToolBar.current;
      const controlContainerPMDraw = controlContainerRefPMDraw.current;
      const controlContainerPMEdit = controlContainerRefPMEdit.current;
      const controlContainerShapefileDownload =
        controlContainerRefShapefileDownload.current;
      const controlContainerTopRight = controlContainerRefTopRight.current;

      const shouldShowSidebar = isSidebarVisible;

      if (controlContainerTop) {
        controlContainerTop.classList.toggle(
          "sidebar-visible",
          shouldShowSidebar
        );
      }
      if (controlContainerTable) {
        controlContainerTable.classList.toggle(
          "sidebar-visible",
          shouldShowSidebar
        );
      }

      if (controlContainerFilter) {
        controlContainerFilter.classList.toggle(
          "sidebar-visible",
          shouldShowSidebar
        );
      }
      if (controlContainerToolBar) {
        controlContainerToolBar.classList.toggle(
          "sidebar-visible",
          shouldShowSidebar
        );
      }
      if (controlContainerPMDraw) {
        controlContainerPMDraw.classList.toggle(
          "sidebar-visible",
          shouldShowSidebar
        );
      }
      if (controlContainerPMEdit) {
        controlContainerPMEdit.classList.toggle(
          "sidebar-visible",
          shouldShowSidebar
        );
      }
      if (controlContainerShapefileDownload) {
        controlContainerShapefileDownload.classList.toggle(
          "sidebar-visible",
          shouldShowSidebar
        );
      }
      if (controlContainerTopRight) {
        controlContainerTopRight.classList.toggle(
          "sidebar-visible",
          shouldShowSidebar
        );
      }
    };

    applySidebarClass();
  }, [isSidebarVisible, isDrawToolsVisible, map]);

  useEffect(() => {
    const applySidebarClass = () => {
      const controlContainerBottomRight =
        controlContainerRefBottomRight.current;
      const controlContainerBottomLeft = controlContainerRefBottomLeft.current;
      const controlContainerLegend = controlContainerRefLegend.current;
      const controlContainerMenu = controlContainerRefMenu.current;

      if (controlContainerBottomRight) {
        controlContainerBottomRight.classList.toggle(
          "table-visible",
          isTableVisible
        );
      }
      if (controlContainerBottomLeft) {
        controlContainerBottomLeft.classList.toggle(
          "table-visible",
          isTableVisible
        );
      }
      if (controlContainerLegend) {
        controlContainerLegend.classList.toggle(
          "table-visible",
          isTableVisible
        );
      }
      if (controlContainerMenu) {
        controlContainerMenu.classList.toggle("table-visible", isTableVisible);
      }
    };

    applySidebarClass();
  }, [isTableVisible, map]);

  return null;
}
