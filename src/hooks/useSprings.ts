import { useQuery } from "@tanstack/react-query";
import { fetchSprings, SpringProps } from "../services/springs/springsApi";

export const useSprings = () => {
  return useQuery<SpringProps[], Error>({
    queryKey: ["springs"],
    queryFn: fetchSprings,
  });
};
