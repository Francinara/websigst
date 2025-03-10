import { api } from "../apiClient";

export type SpringProps = {
  id: number;
  geojson: string;
};

export const fetchSprings = async () => {
  try {
    const response = await api.get<SpringProps[]>("/springs");
    return response.data;
  } catch (error) {
    throw new Error("Erro ao listar Nascentes!");
  }
};
