import { create } from "zustand";
import { Feature } from "geojson";

export type DrawnItemsProps = {
  id: number;
  feature: Feature;
};

interface DowloadStore {
  drawnItems: DrawnItemsProps[];
  addDrawnItem: (item: DrawnItemsProps) => void;
  removeDrawnItem: (id: number) => void;
  editDrawnItem: (id: number, newFeature: Feature) => void;
  resetDrawItem: () => void;
}

export const useDownloadStore = create<DowloadStore>((set) => ({
  drawnItems: [],

  addDrawnItem: (item) =>
    set((state) => ({
      drawnItems: [...state.drawnItems, item],
    })),

  removeDrawnItem: (id) =>
    set((state) => ({
      drawnItems: state.drawnItems.filter((item) => item.id !== id),
    })),

  editDrawnItem: (id, newFeature) =>
    set((state) => ({
      drawnItems: state.drawnItems.map((item) =>
        item.id === id ? { ...item, feature: newFeature } : item
      ),
    })),

  resetDrawItem: () =>
    set(() => ({
      drawnItems: [],
    })),
}));
