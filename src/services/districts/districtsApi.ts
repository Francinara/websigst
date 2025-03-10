import { api } from "../apiClient";

export type DistrictProps = {
  id: number;
  NM_DIST: string;
  geojson: string;
};

export const fetchDistrict = async () => {
  try {
    const response = await api.get<DistrictProps[]>("/districts");
    return response.data;
  } catch (error) {
    throw new Error("Erro ao listar Distritos!");
  }
};
