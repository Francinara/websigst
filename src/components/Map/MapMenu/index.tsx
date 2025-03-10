import { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import ReactDOM from "react-dom";
import MenuContent from "./MenuContent";

export default function MapMenu() {
  const map = useMap();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerDiv, setContainerDiv] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const CustomControl = L.Control.extend({
      onAdd: function () {
        const div = L.DomUtil.create("div", "custom-menu");
        containerRef.current = div;
        L.DomEvent.disableClickPropagation(div);
        L.DomEvent.disableScrollPropagation(div);

        setContainerDiv(div);

        return div;
      },
      onRemove: function () {},
    });

    const customControl = new CustomControl({ position: "topleft" });
    customControl.addTo(map);

    return () => {
      map.removeControl(customControl);
    };
  }, [map]);

  return containerDiv
    ? ReactDOM.createPortal(<MenuContent />, containerDiv)
    : null;
}
