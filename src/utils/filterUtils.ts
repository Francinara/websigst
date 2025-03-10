import { PropertyProps } from "../contexts/MapContext/types";

export function filterByPropertySize(
  property: PropertyProps,
  propertySizeFilter: number[]
) {
  return (
    property.area >= propertySizeFilter[0] &&
    property.area <= propertySizeFilter[1]
  );
}

export function filterByWaterDistance(
  property: PropertyProps,
  waterDistanceFilter: number[]
) {
  return (
    property.water_distance / 1000 >= waterDistanceFilter[0] &&
    property.water_distance / 1000 <= waterDistanceFilter[1]
  );
}
