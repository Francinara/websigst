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

interface PropertyStore {
  property: PropertyProps | null;
  propertiesID: number[];
  updateProperty: (property: PropertyProps | null) => void;
  updatePropertyID: (property: number[]) => void;
}

export const usePropertyStore = create<PropertyStore>((set) => ({
  property: null,
  propertiesID: [],
  updateProperty: (property) => set(() => ({ property })),
  updatePropertyID: (propertiesID) => set(() => ({ propertiesID })),
}));
