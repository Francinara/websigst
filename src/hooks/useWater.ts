import { useQuery } from "@tanstack/react-query";
import { fetchWater, WaterProps } from "../services/water/waterApi";

export const useWater = () => {
  return useQuery<WaterProps[], Error>({
    queryKey: ["waters"],
    queryFn: fetchWater,
  });
};
