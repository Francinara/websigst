import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useProperties } from "../../hooks/useProperties";
import { ProtectionLayer } from "../Map/Layers/ProtectionLayer";
import { PropertyLayer } from "../Map/Layers/PropertyLayer";
const bounds: [[number, number], [number, number]] = [
  [-10.579621910034739, -42.41821289062501], // sudoeste
  [-6.260697372951359, -33.97521972656251], // nordeste
];
export default function Map() {
  const { data: properties } = useProperties();
  return (
    <MapContainer
      center={[-8.072111864818805, -38.38523229242289]}
      zoom={9}
      className="h-full w-full"
      minZoom={8}
      maxBounds={bounds}
      maxBoundsViscosity={1.0}
      attributionControl={false}
    >
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
        attribution="Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ"
      />
      {properties && <PropertyLayer properties={properties} />}
      <ProtectionLayer />
    </MapContainer>
  );
}
