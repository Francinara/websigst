import { create } from "zustand";
import { activityOptions } from "../components/Map/MapMenu/MenuContent";
import { activityMap } from "../utils/constants";

// interface ActiveOption {
//   value: typeof activityMap;
//   label: JSX.Element;
//   icon: JSX.Element;
// }

interface UIStore {
  isSidebarVisible: boolean;
  isChartsVisible: boolean;
  isDrawToolsVisible: boolean;
  isFilterVisible: boolean;
  isTableVisible: boolean;
  isAreaFilterVisible: boolean;
  activeOption: {
    value: activityMap;
    label: JSX.Element;
    icon: JSX.Element;
  };
  updateIsSidebarVisible: (isSidebarVisible: boolean) => void;
  updateIsChartsVisible: (isChartsVisible: boolean) => void;
  updateIsDrawToolsVisible: (IsDrawToolsVisible: boolean) => void;
  updateIsFilterVisible: (isFilterVisible: boolean) => void;
  updateIsTableVisible: (isTableVisible: boolean) => void;
  updateIsAreaFilterVisible: (isAreaFilterVisible: boolean) => void;
  updateActiveOption: (activeOption: {
    value: activityMap;
    label: JSX.Element;
    icon: JSX.Element;
  }) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isSidebarVisible: false,
  isChartsVisible: false,
  isDrawToolsVisible: false,
  isFilterVisible: false,
  isTableVisible: false,
  isAreaFilterVisible: false,
  activeOption: activityOptions[0],

  updateIsSidebarVisible: (isSidebarVisible) =>
    set(() => ({ isSidebarVisible })),
  updateIsChartsVisible: (isChartsVisible) => set(() => ({ isChartsVisible })),
  updateIsDrawToolsVisible: (isDrawToolsVisible) =>
    set(() => ({ isDrawToolsVisible })),
  updateIsFilterVisible: (isFilterVisible) => set(() => ({ isFilterVisible })),
  updateIsTableVisible: (isTableVisible) => set(() => ({ isTableVisible })),
  updateIsAreaFilterVisible: (isAreaFilterVisible) =>
    set(() => ({ isAreaFilterVisible })),
  updateActiveOption: (activeOption) => set(() => ({ activeOption })),
}));
