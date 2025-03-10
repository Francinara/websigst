import { useQuery } from "@tanstack/react-query";
import {
  fetchDistrict,
  DistrictProps,
} from "../services/districts/districtsApi";

export const useDistricts = () => {
  return useQuery<DistrictProps[], Error>({
    queryKey: ["districts"],
    queryFn: fetchDistrict,
  });
};
