import { api } from "../apiClient";

export type BeneficiariesProps = {
  id: number;
  apelido: string;
  cpf: string;
  sexo: "Masculino" | "Feminino" | "Outro";
  estado_civil: "Solteiro" | "Casado" | "Divorciado" | "Viúvo" | string;
  nome_mae: string;
  nome_conjugue: string | null;
  naturalidade: string;
  n_membro_familia: number;
  renda_familiar: number;
  data_nascimento: string;
  dap: string;
  data_dap: string;
  tipo_dap: string;
  programa_governamental: string | null;
  outro_programa_governamental: string | null;
  nis: string;
  contato: string;
  categoria_beneficiario: string;
  associado: boolean;
  associacao: string;
  nome_completo: string;
  credito_rural: boolean;
  tipo_credito_rural: string | null;
};
export const fetchBeneficiaries = async () => {
  try {
    const response = await api.get<BeneficiariesProps[]>("/beneficiaries");
    return response.data;
  } catch (error) {
    throw new Error("Erro ao listar Beneficiários!");
  }
};
