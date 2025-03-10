import { useContext } from "react";
import { MapContext } from "../contexts/MapContext";

export function useMapa() {
  const context = useContext(MapContext);

  if (!context) {
    throw new Error("useMap must be used within an MapProvider");
  }

  return context;
}

export default useMapa;
