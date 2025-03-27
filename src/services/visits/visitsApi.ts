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

export const fetchVisits = async (
  filters: Partial<
    VisitsProps & {
      data_inicio?: string;
      data_fim?: string;
      data_ultima_visita_inicio?: string;
      data_ultima_visita_fim?: string;
    }
  > = {}
) => {
  try {
    const response = await api.get<VisitsProps[]>("/visits", {
      params: filters,
    });
    return response.data;
  } catch (error) {
    throw new Error("Erro ao listar Visitas!");
  }
};
