import { create } from "zustand";

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

export type DistrictOption = {
  value: string;
  label: string;
};

interface DashboardStore {
  property: PropertyProps | null;
  propertiesID: number[];
  yearsInterval: number[];
  district: DistrictOption[];
  updateDistrict: (item: DistrictOption[]) => void;
  updateYearsInterval: (yearsInterval: number[]) => void;
  updateProperty: (property: PropertyProps | null) => void;
  updatePropertyID: (propertiesID: number[]) => void;
  resetDistrict: () => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  property: null,
  propertiesID: [],
  yearsInterval: [],
  district: [],
  updateDistrict: (district) => set(() => ({ district })),
  resetDistrict: () =>
    set(() => ({
      district: [],
    })),
  updateYearsInterval: (yearsInterval) => set(() => ({ yearsInterval })),
  updateProperty: (property) => set(() => ({ property })),
  updatePropertyID: (propertiesID) => set(() => ({ propertiesID })),
}));
