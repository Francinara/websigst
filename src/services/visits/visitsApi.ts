import { api } from "../apiClient";

export type VisitsProps = {
  numero: number;
  data: string;
  tecnico_responsavel: string;
  data_ultima_visita: string;
  diagnostico: string;
  recomendacoes: string;
  finalidade_visita: string;
  propriedade_id: number;
};
export const fetchVisits = async () => {
  try {
    const response = await api.get<VisitsProps[]>("/visits");
    return response.data;
  } catch (error) {
    throw new Error("Erro ao listar Visitas!");
  }
};
