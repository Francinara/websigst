import { useQuery } from "@tanstack/react-query";
import {
  fetchUrbanizedAreas,
  UrbanizedAreasProps,
} from "../services/urbanized-areas/urbanizedAreasApi";

export const useUrbanizedAreas = () => {
  return useQuery<UrbanizedAreasProps[], Error>({
    queryKey: ["urbanizedAreas"],
    queryFn: fetchUrbanizedAreas,
  });
};
