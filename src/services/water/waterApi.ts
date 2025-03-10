import { api } from "../apiClient";

export type WaterProps = {
  id: number;
  nome: string;
  geojson: string;
};
export const fetchWater = async () => {
  try {
    const response = await api.get<WaterProps[]>("/waters");
    return response.data;
  } catch (error) {
    throw new Error("Erro ao listar Corpos d'Água!");
  }
};
