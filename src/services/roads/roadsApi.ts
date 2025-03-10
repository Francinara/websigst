import { api } from "../apiClient";

export type RoadProps = {
  id: number;
  name: string;
  geojson: string;
};

export const fetchRoad = async () => {
  try {
    const response = await api.get<RoadProps[]>("/roads");
    return response.data;
  } catch (error) {
    throw new Error("Erro ao listar Estradas!");
  }
};
