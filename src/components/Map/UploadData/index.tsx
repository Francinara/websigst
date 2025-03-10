import { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import ReactDOM from "react-dom";
import UploadDataContent from "./UploadDataContent";

export default function UploadData() {
  const map = useMap();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerDiv, setContainerDiv] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const CustomControl = L.Control.extend({
      onAdd: function () {
        const div = L.DomUtil.create("div", "custom-table");
        containerRef.current = div;
        L.DomEvent.disableClickPropagation(div);
        L.DomEvent.disableScrollPropagation(div);

        setContainerDiv(div);

        return div;
      },
      onRemove: function () {},
    });

    const customControl = new CustomControl({ position: "bottomleft" });
    customControl.addTo(map);

    return () => {
      map.removeControl(customControl);
    };
  }, [map]);

  return containerDiv
    ? ReactDOM.createPortal(<UploadDataContent />, containerDiv)
    : null;
}
