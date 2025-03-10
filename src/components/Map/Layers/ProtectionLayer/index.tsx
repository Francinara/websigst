import { GeoJSON, useMap } from "react-leaflet";
import { useProtectionLayer } from "../../../../hooks/useProtectionLayer";

export function ProtectionLayer() {
  const style = {
    color: "#006400",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.2,
    dashArray: "6 6",
  };

  const map = useMap();
  const { data: protectionLayer, isLoading } = useProtectionLayer();

  if (isLoading) return null;

  return (
    <>
      {protectionLayer?.map((layer) => (
        <GeoJSON
          key={layer.id}
          data={JSON.parse(layer.geojson)}
          style={style}
          pmIgnore={true}
          eventHandlers={{
            mouseover: () => {
              map.closePopup();
            },
          }}
        />
      ))}
    </>
  );
}
