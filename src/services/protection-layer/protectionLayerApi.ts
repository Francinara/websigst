import { api } from "../apiClient";

export type ProtectionLayerProps = {
  id: number;
  geojson: string;
};

export const fetchProtectionLayer = async () => {
  try {
    const response = await api.get<ProtectionLayerProps[]>("/protection-layer");
    return response.data;
  } catch (error) {
    throw new Error("Erro ao listar Camada de Proteção!");
  }
};
