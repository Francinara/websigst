import { api } from "../apiClient";

export type UrbanizedAreasProps = {
  id: number;
  densidade: string;
  tipo: string;
  geojson: string;
};

export const fetchUrbanizedAreas = async () => {
  try {
    const response = await api.get<UrbanizedAreasProps[]>("/urbanized-areas");
    return response.data;
  } catch (error) {
    throw new Error("Erro ao listar Áreas Urbanizadas!");
  }
};
