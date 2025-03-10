import { create } from "zustand";

export type AreaFilterProps = {
  radius: number;
  lat: number;
  lng: number;
  updateAreaFilter: (radius: number, lat: number, lng: number) => void;
};

interface AreaFilterState extends Omit<AreaFilterProps, "updateAreaFilter"> {
  updateAreaFilter: (radius: number, lat: number, lng: number) => void;
}

export const useAreaFilter = create<AreaFilterState>((set) => ({
  radius: 10,
  lat: 0,
  lng: 0,
  updateAreaFilter: (radius, lat, lng) => set(() => ({ radius, lat, lng })),
}));
