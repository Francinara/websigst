import { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import ReactDOM from "react-dom";
import GradientBarContent from "./GradientBarContent";
import { useLegendStore } from "../../../store/useLegendStore";

export default function GradientBar() {
  const map = useMap();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerDiv, setContainerDiv] = useState<HTMLDivElement | null>(null);
  const legend = useLegendStore();

  useEffect(() => {
    const CustomControl = L.Control.extend({
      onAdd: function () {
        const div = L.DomUtil.create("div", "custom-filter");
        containerRef.current = div;
        L.DomEvent.disableClickPropagation(div);
        L.DomEvent.disableScrollPropagation(div);
        setContainerDiv(div);
        return div;
      },
      onRemove: function () {},
    });

    const customControl = new CustomControl({ position: "bottomright" });
    customControl.addTo(map);

    return () => {
      map.removeControl(customControl);
    };
  }, [map]);

  return containerDiv
    ? ReactDOM.createPortal(
        legend.propertyDensityVisible && <GradientBarContent />,
        containerDiv
      )
    : null;
}
