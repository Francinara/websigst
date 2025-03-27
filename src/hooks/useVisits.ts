import { useQuery } from "@tanstack/react-query";
import { VisitsProps, fetchVisits } from "../services/visits/visitsApi";

export const useVisits = (
  filters: Partial<
    VisitsProps & {
      data_inicio?: string;
      data_fim?: string;
      data_ultima_visita_inicio?: string;
      data_ultima_visita_fim?: string;
    }
  > = {}
) => {
  return useQuery<VisitsProps[], Error>({
    queryKey: ["visits", filters],
    queryFn: () => fetchVisits(filters),
  });
};
