import { useQuery } from "@tanstack/react-query";
import {
  fetchCommunities,
  CommunityProps,
} from "../services/communities/communitiesApi";

export const useCommunities = () => {
  return useQuery<CommunityProps[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });
};
