import { ReactNode } from "react";
// import { FeatureCollectionWithFilename } from "shpjs";
// import { Feature } from "geojson";
// import { activityMap } from "../../utils/constants";

export type MapContextData = {
  // areaFilter: AreaFilterProps;
  // setAreaFilter: (areaFilter: AreaFilterProps) => void;
  // selectedYear: number | undefined;
  // setSelectedYear: (year: number | undefined) => void;
  // propertySizeFilter: number[];
  // setPropertySizeFilter: (propertySizeFilter: number[]) => void;
  // waterDistanceFilter: number[];
  // setWaterDistanceFilter: (waterDistanceFilter: number[]) => void;
  // upload: FileProps[];
  // setUpload: (upload: FileProps[]) => void;
  // drawnItems: drawnItemsProps[];
  // setDrawnItems: (drawnItems: drawnItemsProps[]) => void;
  // propertiesID: number[];
  // setPropertiesID: (propertiesID: number[]) => void;
  // property: PropertyProps | null;
  // setProperty: (property: PropertyProps | null) => void;
  // district: DistrictProps | null;
  // setDistrict: (district: DistrictProps | null) => void;
  // activeOption: {
  //   value: activityMap;
  //   label: JSX.Element;
  //   icon: JSX.Element;
  // };
  // setActiveOption: (option: {
  //   value: activityMap;
  //   label: JSX.Element;
  //   icon: JSX.Element;
  // }) => void;
  // drawToolsVisible: boolean;
  // setDrawToolsVisible: (drawToolsVisible: boolean) => void;
  // isFilterVisible: boolean;
  // setIsFilterVisible: (isFilterVisible: boolean) => void;
  // isTableVisible: boolean;
  // setIsTableVisible: (isTableVisible: boolean) => void;
  // isAreaFilterVisible: boolean;
  // setIsAreaFilterVisible: (isAreaFilterVisible: boolean) => void;
  // legend: LegendProps;
  // isSidebarVisible: boolean;
  // setIsSidebarVisible: (isSidebarVisible: boolean) => void;
  // isChartsVisible: boolean;
  // setIsChartsVisible: (isChartsVisible: boolean) => void;

  listProductiveActivityByProperty: (
    property_id: number,
    activity: number
  ) => Promise<
    | AgricultureProps[]
    | AquacultureProps[]
    | BeekeepingProps[]
    | LivestockProps[]
    | CraftsmanshipProps[]
    | OtherActivitiesProps[]
  >;
  listProductiveActivityByActivity: (
    activity: number
  ) => Promise<
    | AgricultureProps[]
    | AquacultureProps[]
    | BeekeepingProps[]
    | LivestockProps[]
    | CraftsmanshipProps[]
    | OtherActivitiesProps[]
  >;
  listWaterResourceByProperty(
    property_id: number
  ): Promise<WaterResourceByPropertyProps[]>;
  // listRecentVisitByProperty(property_id: number): Promise<VisitProps>;
  listProperty: () => Promise<PropertyProps[]>;
  listBeneficiario: () => Promise<BeneficiarioProps[]>;
  listWaterResouces: () => Promise<WaterResourceProps[]>;
  // listPropertyWithSelectedActivities: (
  //   activities: string
  // ) => Promise<PropertyProps[]>;
  // listWater(): Promise<WaterProps[]>;
  // listDrainage(): Promise<DrainageProps[]>;
  // listDistrict(): Promise<DistrictProps[]>;
  // listRoad(): Promise<RoadProps[]>;
  // listUrbanizedArea(): Promise<UrbanizedAreaProps[]>;
  // listCommunity(): Promise<CommunityProps[]>;
  // listSpring(): Promise<SpringProps[]>;
  // listSubBasin(): Promise<SubBasinProps[]>;
  // listProtectionLayer(): Promise<ProtectionLayerProps[]>;
};

// export type FileProps = {
//   name: string;
//   feature: FeatureCollectionWithFilename;
//   size: string;
//   editable: boolean;
// };

// export type drawnItemsProps = {
//   id: number;
//   feature: Feature;
// };

// export type AreaFilterProps = {
//   radius: number;
//   lat: number;
//   lng: number;
//   updateAreaFilter: (radius: number, lat: number, lng: number) => void;
// };

// export type LegendProps = {
//   urbanizedAreasVisible: boolean;
//   communitysVisible: boolean;
//   districtsVisible: boolean;
//   roadBR232Visible: boolean;
//   roadPE320Visible: boolean;
//   roadPE365Visible: boolean;
//   roadPE390Visible: boolean;
//   roadPE418Visible: boolean;
//   roadPavedVisible: boolean;
//   roadUnpavedVisible: boolean;
//   watersVisible: boolean;
//   drainagesVisible: boolean;
//   springsVisible: boolean;
//   subBasinVisible: boolean;
//   propertyDensityVisible: boolean;
//   propertyVisible: boolean;
//   updateLegend: (key: keyof LegendProps, value: boolean) => void;
// };

export type WaterResourceByPropertyProps = {
  id: number;
  propriedade_id: number;
  carro_pipa_id: number;
  poco_id: number;
  poco_amazonas_id: number;
  acude_id: number;
  barragem_id: number;
  banheiro_id: number;
  cisternas_id: number;
  tipo_cisterna: string;
  capacidade_cisterna: number;
  fornecedor_carro_pipa: string;
  quantidade_mes_litro: number;
  propriedade_poco: string;
  qualidade_poco: string;
  bomba_poco: boolean;
  vazao_poco: number;
  propriedade_poco_amazonas: string;
  qualidade_poco_amazonas: string;
  bomba_poco_amazonas: boolean;
  vazao_poco_amazonas: number;
  propriedade_acude: string;
  capacidade_acude: number;
  capacidade_barragem: number;
  propriedade_barragem: string;
  n_banheiros: number;
  fossa: boolean;
  outros_banheiros: string;
};

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
  data: number;
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
  data: number;
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
  data: number;
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
  data: number;
  visita_id: number;
  distrito: string;
};

export type CraftsmanshipProps = {
  id: number;
  produto: string;
  destinacao_valor: string;
  propriedade_id: number;
  data: number;
  visita_id: number;
  distrito: string;
};
export type OtherActivitiesProps = {
  id: number;
  tipo: string;
  descricao: string;
  propriedade_id: number;
  data: number;
  visita_id: number;
  distrito: string;
};

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

export type BeneficiarioProps = {
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

export type VisitProps = {
  numero: number;
  data: string;
  tecnico_responsavel: string;
  data_ultima_visita: string;
  diagnostico: string;
  recomendacoes: string;
  finalidade_visita: string;
  propriedade_id: number;
};

export type WaterProps = {
  id: number;
  nome: string;
  geojson: string;
};

export type DrainageProps = {
  id: number;
  geojson: string;
};

export type UrbanizedAreaProps = {
  id: number;
  densidade: string;
  tipo: string;
  geojson: string;
};

export type DistrictProps = {
  id: number;
  NM_DIST: string;
  geojson: string;
};

export type RoadProps = {
  id: number;
  name: string;
  geojson: string;
};

export type CommunityProps = {
  id: number;
  nome: string;
  distritos: string;
  geojson: string;
};

export type SpringProps = {
  id: number;
  geojson: string;
};

export type SubBasinProps = {
  id: number;
  geojson: string;
};

export type ProtectionLayerProps = {
  id: number;
  geojson: string;
};

export type MapProviderProps = {
  children: ReactNode;
};
