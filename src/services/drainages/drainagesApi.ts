import { api } from "../apiClient";

export type DrainagesProps = {
  id: number;
  geojson: string;
};

export const fetchDrainages = async () => {
  try {
    const response = await api.get<DrainagesProps[]>("/drainages");
    return response.data;
  } catch (error) {
    throw new Error("Erro ao listar Drenagens!");
  }
};
