import { create } from "zustand";

export interface FileProps {
  name: string;
  feature: {
    type: "Feature";
    geometry: {
      bbox: number[];
      type: string;
      coordinates: number[][][];
    };
    properties: Record<string, any>;
  }[];
  size: string;
  editable: boolean;
}

interface UploadStore {
  upload: FileProps[];
  addUpload: (item: FileProps) => void;
  removeUpload: (index: number) => void;
  editUpload: (index: number) => void;
  resetUploads: () => void;
}

export const useUploadStore = create<UploadStore>((set) => ({
  upload: [],

  addUpload: (item) =>
    set((state) => ({
      upload: [...state.upload, item],
    })),

  removeUpload: (index) =>
    set((state) => ({
      upload: state.upload.filter((_item, i) => i !== index),
    })),

  editUpload: (index) =>
    set((state) => ({
      upload: state.upload.map((item, i) =>
        i === index ? { ...item, editable: !item.editable } : item
      ),
    })),

  resetUploads: () =>
    set(() => ({
      upload: [],
    })),
}));
