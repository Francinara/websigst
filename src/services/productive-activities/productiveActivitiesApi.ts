import { api } from "../apiClient";

export type AgricultureProps = {
  id: number;
  data_colheita: string;
  producao_ano: number;
  irrigacao: boolean;
  destinacao_venda: number;
  area_cultivo: number;
  data_plantio: string;
  destinacao_casa: number;
  valor_comercializado: number;
  cultura: string;
  propriedade_id: number;
  data: string; // Corrigido para string (vem como ISO do backend)
  visita_id: number;
  distrito: string;
};

export type AquacultureProps = {
  id: number;
  aptidao_corte: boolean;
  aptidao_reproducao: boolean;
  lamina_agua: string;
  quantidade: number;
  cultura: string;
  especie: string;
  valor_comercializacao: number;
  tipo_cricao_super_intensivo: boolean;
  tipo_cricao_intensivo: boolean;
  tipo_cricao_semi_intensivo: boolean;
  tipo_cricao_extensivo: boolean;
  destinacao_casa: number;
  destinacao_verda: number;
  propriedade_id: number;
  data: string;
  visita_id: number;
  distrito: string;
};

export type BeekeepingProps = {
  id: number;
  n_colmeias: number;
  destinacao_mel: string;
  tipo_criacao: boolean;
  tipo_extrativismo: boolean;
  propriedade_id: number;
  com_ferrao: boolean;
  sem_ferrao: boolean;
  data: string;
  visita_id: number;
  distrito: string;
};

export type LivestockProps = {
  id: number;
  especie: string;
  quantidade: number;
  aptidao_corte: boolean;
  aptidao_leite: boolean;
  aptidao_postura: boolean;
  tipo_cricao_intensivo: boolean;
  tipo_cricao_semi_intensivo: boolean;
  tipo_cricao_extensivo: boolean;
  destinacao_casa: number;
  raca_predominante: string;
  valor_comercializacao: number;
  destinacao_venda: number;
  propriedade_id: number;
  data: string;
  visita_id: number;
  distrito: string;
};

export type CraftsmanshipProps = {
  id: number;
  produto: string;
  destinacao_valor: string;
  propriedade_id: number;
  data: string;
  visita_id: number;
  distrito: string;
};

export type OtherActivitiesProps = {
  id: number;
  tipo: string;
  descricao: string;
  propriedade_id: number;
  data: string;
  visita_id: number;
  distrito: string;
};

export type ProductiveActivityProps =
  | AgricultureProps[]
  | AquacultureProps[]
  | BeekeepingProps[]
  | LivestockProps[]
  | CraftsmanshipProps[]
  | OtherActivitiesProps[];

export const fetchProductiveActivitiesByActivity = async (
  activity: number,
  filters: Record<string, string | number | boolean | undefined> = {}
) => {
  try {
    const response = await api.get<ProductiveActivityProps>(
      "/productive-activity/activity",
      {
        params: { activity, ...filters },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Erro ao listar atividades produtivas!");
  }
};
