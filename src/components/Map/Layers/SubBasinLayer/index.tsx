import { GeoJSON } from "react-leaflet";
import { useSubBasins } from "../../../../hooks/useSubBasins";

export function SubBasinLayer({ color }: { color: string }) {
  const style = {
    color: color,
    weight: 2,
    opacity: 0.6,
    fillColor: color,
    fillOpacity: 0.2,
  };

  const { data: subBasins, isLoading } = useSubBasins();

  if (isLoading) return null;

  return (
    <>
      {subBasins?.map((subBasin) => (
        <GeoJSON
          key={subBasin.id}
          data={JSON.parse(subBasin.geojson)}
          style={style}
          pmIgnore={true}
        />
      ))}
    </>
  );
}
