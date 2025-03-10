import { useQuery } from "@tanstack/react-query";
import {
  fetchProtectionLayer,
  ProtectionLayerProps,
} from "../services/protection-layer/protectionLayerApi";

export const useProtectionLayer = () => {
  return useQuery<ProtectionLayerProps[], Error>({
    queryKey: ["protectionLayer"],
    queryFn: fetchProtectionLayer,
  });
};
