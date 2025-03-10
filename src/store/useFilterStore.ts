import { create } from "zustand";

interface FilterStore {
  propertySizeFilter: number[];
  waterDistanceFilter: number[];
  updatePropertySizeFilter: (propertySizeFilter: number[]) => void;
  updateWaterDistanceFilter: (waterDistanceFilter: number[]) => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  propertySizeFilter: [0, 100],
  waterDistanceFilter: [0, 100],

  updatePropertySizeFilter: (propertySizeFilter) =>
    set(() => ({ propertySizeFilter })),
  updateWaterDistanceFilter: (waterDistanceFilter) =>
    set(() => ({ waterDistanceFilter })),
}));
