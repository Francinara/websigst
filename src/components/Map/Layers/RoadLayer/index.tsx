import { GeoJSON } from "react-leaflet";
import { useRoads } from "../../../../hooks/useRoads";

export function RoadLayer({ name, color }: { name: string; color: string }) {
  const { data: roads, isLoading } = useRoads();

  const style = {
    color: color,
    weight: 2,
    opacity: 0.6,
    fillColor: "transparent",
    fillOpacity: 0,
  };

  const filteredRoads = roads?.filter((road) => road.name === name);

  if (isLoading) return null;

  return (
    <>
      {filteredRoads?.map((road) => (
        <GeoJSON
          key={road.id}
          data={JSON.parse(road.geojson)}
          style={style}
          pmIgnore={true}
        />
      ))}
    </>
  );
}
