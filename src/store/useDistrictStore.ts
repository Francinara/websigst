import { create } from "zustand";

export type DistrictProps = {
  id: number;
  NM_DIST: string;
  geojson: string;
};

interface DistrictStore {
  district: DistrictProps | null;
  updateDistrict: (district: DistrictProps | null) => void;
  resetDistrict: () => void;
}

export const useDistrictStore = create<DistrictStore>((set) => ({
  district: null,
  updateDistrict: (district) => set(() => ({ district })),
  resetDistrict: () =>
    set(() => ({
      district: null,
    })),
}));
