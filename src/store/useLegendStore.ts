import { create } from "zustand";

export type LegendProps = {
  urbanizedAreasVisible: boolean;
  communitysVisible: boolean;
  districtsVisible: boolean;
  roadBR232Visible: boolean;
  roadPE320Visible: boolean;
  roadPE365Visible: boolean;
  roadPE390Visible: boolean;
  roadPE418Visible: boolean;
  roadPavedVisible: boolean;
  roadUnpavedVisible: boolean;
  watersVisible: boolean;
  drainagesVisible: boolean;
  springsVisible: boolean;
  subBasinVisible: boolean;
  propertyDensityVisible: boolean;
  propertyVisible: boolean;
};

interface LegendStore extends LegendProps {
  updateLegend: (key: keyof LegendProps, value: boolean) => void;
}

export const useLegendStore = create<LegendStore>((set) => ({
  urbanizedAreasVisible: false,
  communitysVisible: false,
  districtsVisible: true,
  roadBR232Visible: false,
  roadPE320Visible: false,
  roadPE365Visible: false,
  roadPE390Visible: false,
  roadPE418Visible: false,
  roadPavedVisible: false,
  roadUnpavedVisible: false,
  watersVisible: false,
  drainagesVisible: false,
  springsVisible: false,
  subBasinVisible: false,
  propertyDensityVisible: true,
  propertyVisible: false,

  updateLegend: (key, value) => set((state) => ({ ...state, [key]: value })),
}));
