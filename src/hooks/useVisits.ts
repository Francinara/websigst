import { useQuery } from "@tanstack/react-query";
import { VisitsProps, fetchVisits } from "../services/visits/visitsApi";

export const useVisits = () => {
  return useQuery<VisitsProps[], Error>({
    queryKey: ["visits"],
    queryFn: fetchVisits,
  });
};
