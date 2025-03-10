import { api } from "../apiClient";

export type CommunityProps = {
  id: number;
  nome: string;
  distritos: string;
  geojson: string;
};

export const fetchCommunities = async () => {
  try {
    const response = await api.get<CommunityProps[]>("/communities");
    return response.data;
  } catch (error) {
    throw new Error("Erro ao listar Comunidades!");
  }
};
