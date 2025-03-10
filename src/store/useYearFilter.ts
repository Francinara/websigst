import { create } from "zustand";

interface SelectedYearStore {
  selectedYear: number | undefined;
  updateSelectedYear: (selectedYear: number | undefined) => void;
}

export const useSelectedYearStore = create<SelectedYearStore>((set) => ({
  selectedYear: undefined,
  updateSelectedYear: (selectedYear) => set(() => ({ selectedYear })),
}));
