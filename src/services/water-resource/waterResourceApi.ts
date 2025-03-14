import { api } from "../apiClient";

export type WaterResourceProps = {
  id: number;
  propriedade_id: number;
  carro_pipa_id: number | null;
  poco_id: number | null;
  poco_amazonas_id: number | null;
  acude_id: number | null;
  barragem_id: number | null;
  banheiro_id: number | null;
  cisternas_id: number | null;
  tipo_cisterna: string | null;
  capacidade_cisterna: number | null;
  fornecedor_carro_pipa: string | null;
  quantidade_mes_litro: number | null;
  propriedade_poco: string | null;
  qualidade_poco: string | null;
  bomba_poco: boolean | null;
  vazao_poco: number | null;
  propriedade_poco_amazonas: string | null;
  qualidade_poco_amazonas: string | null;
  bomba_poco_amazonas: boolean | null;
  vazao_poco_amazonas: number | null;
  propriedade_acude: string | null;
  capacidade_acude: number | null;
  capacidade_barragem: number | null;
  propriedade_barragem: string | null;
  n_banheiros: number | null;
  fossa: boolean | null;
  outros_banheiros: string | null;
};
export const fetchWaterResources = async () => {
  try {
    const response = await api.get<WaterResourceProps[]>(
      "/water-resources/properties"
    );
    return response.data;
  } catch (error) {
    throw new Error("Erro ao listar recursos hídricos!");
  }
};
