import { useQuery } from "@tanstack/react-query";
import {
  fetchProductiveActivitiesByActivity,
  ProductiveActivityProps,
} from "../services/productive-activities/productiveActivitiesApi";

export const useProductiveActivities = (
  activity: number,
  filters: Record<string, string | number | boolean | undefined> = {}
) => {
  return useQuery<ProductiveActivityProps, Error>({
    queryKey: ["productive-activities", activity, filters],
    queryFn: () => fetchProductiveActivitiesByActivity(activity, filters),
  });
};
