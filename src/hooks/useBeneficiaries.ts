import { useQuery } from "@tanstack/react-query";
import {
  fetchBeneficiaries,
  BeneficiariesProps,
} from "../services/beneficiaries/beneficiariesApi";

export const useBeneficiaries = () => {
  return useQuery<BeneficiariesProps[], Error>({
    queryKey: ["beneficiaries"],
    queryFn: fetchBeneficiaries,
  });
};
