import { useQuery } from "@tanstack/react-query";
import { fetchRoad, RoadProps } from "../services/roads/roadsApi";

export const useRoads = () => {
  return useQuery<RoadProps[], Error>({
    queryKey: ["roads"],
    queryFn: fetchRoad,
  });
};
