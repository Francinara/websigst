import { GeoJSON } from "react-leaflet";
import { useUrbanizedAreas } from "../../../../hooks/useUrbanizedAreas";

type DensityType = "Densa" | "Pouco densa" | "Loteamento vazio";

const densityColors: Record<DensityType, string> = {
  Densa: "#006400",
  "Pouco densa": "#90a36c",
  "Loteamento vazio": "#cad6a4",
};

export function UrbanizedAreaLayer() {
  const getStyle = (attribute: DensityType) => ({
    color: densityColors[attribute],
    weight: 0,
    opacity: 1,
    fillColor: densityColors[attribute],
    fillOpacity: 0.8,
  });

  const { data: urbanizedAreas, isLoading } = useUrbanizedAreas();

  if (isLoading) return null;

  return (
    <>
      {urbanizedAreas?.map((urbanizedArea) => (
        <GeoJSON
          key={urbanizedArea.id}
          data={JSON.parse(urbanizedArea.geojson)}
          style={() => getStyle(urbanizedArea.densidade as DensityType)}
          pmIgnore={true}
        />
      ))}
    </>
  );
}
