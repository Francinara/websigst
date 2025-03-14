import { useQuery } from "@tanstack/react-query";
import {
  fetchWaterResources,
  WaterResourceProps,
} from "../services/water-resource/waterResourceApi";

export const useWaterResources = () => {
  return useQuery<WaterResourceProps[], Error>({
    queryKey: ["water_resources"],
    queryFn: fetchWaterResources,
  });
};
