import {
  AgricultureProps,
  AquacultureProps,
  CraftsmanshipProps,
  LivestockProps,
  OtherActivitiesProps,
  PropertyProps,
  BeneficiarioProps,
  WaterResourceProps,
} from "../contexts/MapContext/types";

export type newPropertyProps = {
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
  apiculturas: boolean;
  artesanato: boolean;
  outras_atividades: boolean;
  water_distance: number;
  activity: string;
};

export type VisibilityOptions =
  | VisibilityOptionsAgriculture
  | VisibilityOptionsAquaculture
  | VisibilityOptionsBeekeeping
  | VisibilityOptionsCraftsmanship
  | VisibilityOptionsLivestock
  | VisibilityOptionsOtherActivities;

export type OptionsUnits =
  | Record<VisibilityOptionsAgriculture, string>
  | Record<VisibilityOptionsAquaculture, string>
  | Record<VisibilityOptionsBeekeeping, string>
  | Record<VisibilityOptionsCraftsmanship, string>
  | Record<VisibilityOptionsLivestock, string>
  | Record<VisibilityOptionsOtherActivities, string>;

export type VisibilityOptionsType =
  | typeof VisibilityOptionsAgriculture
  | typeof VisibilityOptionsAquaculture
  | typeof VisibilityOptionsOtherActivities
  | typeof VisibilityOptionsCraftsmanship
  | typeof VisibilityOptionsBeekeeping
  | typeof VisibilityOptionsLivestock;

export type ProductiveActivities =
  | AgricultureProps
  | LivestockProps
  | AquacultureProps
  | newDataBeekeepingProps
  | CraftsmanshipProps
  | OtherActivitiesProps;

export type CompleteProductiveActivity = AgricultureProps &
  AquacultureProps &
  LivestockProps &
  CraftsmanshipProps &
  OtherActivitiesProps &
  newDataBeekeepingProps &
  newPropertyProps &
  PropertyProps &
  BeneficiarioProps &
  WaterResourceProps;

export type ProductiveActivitiesKeys =
  | keyof AgricultureProps
  | keyof LivestockProps
  | keyof AquacultureProps
  | keyof newDataBeekeepingProps
  | keyof CraftsmanshipProps
  | keyof OtherActivitiesProps;

export type newDataBeekeepingProps = {
  especie: string;
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

export enum VisibilityOptionsAgriculture {
  Property = "Propriedades",
  Production = "Produção",
  SaleValue = "Valor de Venda",
  CultivationArea = "Área de Cultivo",
}

export enum VisibilityOptionsAquaculture {
  Property = "Propriedades",
  Production = "Produção",
  SaleValue = "Valor de Vendas",
  CultivationArea = "Lámina D'água",
}

export enum VisibilityOptionsOtherActivities {
  Property = "Propriedade",
}

export enum VisibilityOptionsCraftsmanship {
  Property = "Propriedades",
}

export enum VisibilityOptionsBeekeeping {
  Property = "Propriedades",
  Hives = "Nº de Colmeias",
}

export enum VisibilityOptionsLivestock {
  Property = "Propriedades",
  Specie = "Epécie",
  SaleValue = "Valor de Vendas",
}
