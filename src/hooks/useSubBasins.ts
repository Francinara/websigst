import { useQuery } from "@tanstack/react-query";
import {
  fetchSubBasins,
  SubBasinsProps,
} from "../services/sub-basins/subBasinsApi";

export const useSubBasins = () => {
  return useQuery<SubBasinsProps[], Error>({
    queryKey: ["subBasins"],
    queryFn: fetchSubBasins,
  });
};
