import { useQuery } from "@tanstack/react-query";
import {
  fetchProductiveActivitiesByActivity,
  ProductiveActivityProps,
} from "../services/productive-activities/productiveActivitiesApi";

export const useProductiveActivities = (activity: number) => {
  return useQuery<ProductiveActivityProps, Error>({
    queryKey: ["productive-activities", activity],
    queryFn: () => fetchProductiveActivitiesByActivity(activity),
  });
};
