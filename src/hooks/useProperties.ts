import { useQuery } from "@tanstack/react-query";
import { fetchProperties } from "../services/properties/propertiesApi";

export const useProperties = () => {
  return useQuery({
    queryKey: ["properties"],
    queryFn: fetchProperties,
    refetchInterval: 3000,
  });
};
