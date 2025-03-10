import { api } from "../apiClient";

export type PropertyProps = {
  id: number;
  geojson: string;
  lng: number;
  lat: number;
  car: boolean;
  n_recibo_car: string;
  nome_propriedade: string;
  area: number;
  comunidade: string;
  distrito: string;
  situacao_fundiaria: string;
  tipo_documento: string;
  beneficiario_id: number;
  data: string;
  agricultura: boolean;
  pecuaria: boolean;
  aquicultura: boolean;
  apicultura: boolean;
  artesanato: boolean;
  outras_atividades: boolean;
  water_distance: number;
};

export const fetchProperties = async () => {
  try {
    const response = await api.get<PropertyProps[]>("/properties");
    return response.data;
  } catch (error) {
    throw new Error("Erro ao listar Propriedades!");
  }
};
