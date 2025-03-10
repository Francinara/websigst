import { api } from "../apiClient";

export type SubBasinsProps = {
  id: number;
  geojson: string;
};

export const fetchSubBasins = async () => {
  try {
    const response = await api.get<SubBasinsProps[]>("/sub-basins");
    return response.data;
  } catch (error) {
    throw new Error("Erro ao listar Sub-bacias!");
  }
};
