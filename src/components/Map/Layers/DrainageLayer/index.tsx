import { GeoJSON } from "react-leaflet";
import { useDrainages } from "../../../../hooks/useDrainages";

export function DrainageLayer({ color }: { color: string }) {
  const { data: drainages, isLoading } = useDrainages();

  const style = {
    color: color,
    weight: 2,
    opacity: 1,
    fillColor: color,
    fillOpacity: 1,
  };

  if (isLoading) return null;

  return (
    <>
      {drainages?.map((drainage) => (
        <GeoJSON
          key={drainage.id}
          data={JSON.parse(drainage.geojson)}
          style={style}
          pmIgnore={true}
        />
      ))}
    </>
  );
}
