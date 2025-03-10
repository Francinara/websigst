import { CircleMarker, LayerGroup } from "react-leaflet";
import { useSprings } from "../../../../hooks/useSprings";

export function SpringLayer({ color }: { color: string }) {
  const { data: springs, isLoading } = useSprings();
  const style = {
    color: color,
    weight: 0,
    opacity: 0,
    fillColor: color,
    fillOpacity: 0.5,
  };

  if (isLoading) return null;

  return (
    <LayerGroup>
      {springs?.map((spring) => {
        const position = JSON.parse(spring.geojson).coordinates;
        return (
          <CircleMarker
            key={spring.id}
            center={[position[1], position[0]]}
            radius={5}
            pathOptions={style}
            pmIgnore={true}
          />
        );
      })}
    </LayerGroup>
  );
}
