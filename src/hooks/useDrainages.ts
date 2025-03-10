import { useQuery } from "@tanstack/react-query";
import {
  DrainagesProps,
  fetchDrainages,
} from "../services/drainages/drainagesApi";

export const useDrainages = () => {
  return useQuery<DrainagesProps[], Error>({
    queryKey: ["drainages"],
    queryFn: fetchDrainages,
  });
};
