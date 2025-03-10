import { createContext, useCallback } from "react";
// import { useState } from "react";
import { api } from "../../services/apiClient";
import { toast } from "react-toastify";
import {
  // DistrictProps,
  MapContextData,
  MapProviderProps,
  // PropertyProps,
  // LegendProps,
  // FileProps,
  // drawnItemsProps,
  // AreaFilterProps,
} from "./types";
// import { activityOptions } from "../../components/Map/MapMenu/MenuContent";

export const MapContext = createContext<MapContextData>({} as MapContextData);

export function MapProvider({ children }: MapProviderProps) {
  // const [areaFilter, setAreaFilter] = useState<AreaFilterProps>({
  //   radius: 10,
  //   lat: 0,
  //   lng: 0,
  //   updateAreaFilter: (radius: number, lat: number, lng: number) => {
  //     setAreaFilter((prevState) => ({
  //       ...prevState,
  //       radius: radius,
  //       lat: lat,
  //       lng: lng,
  //     }));
  //   },
  // });
  // const [selectedYear, setSelectedYear] = useState<number | undefined>();
  // const [propertySizeFilter, setPropertySizeFilter] = useState<number[]>([
  //   0, 100,
  // ]);
  // const [waterDistanceFilter, setWaterDistanceFilter] = useState<number[]>([
  //   0, 100,
  // ]);
  // const [upload, setUpload] = useState<FileProps[]>([]);
  // const [drawnItems, setDrawnItems] = useState<drawnItemsProps[]>([]);
  // const [property, setProperty] = useState<PropertyProps | null>(null);
  // const [propertiesID, setPropertiesID] = useState<number[]>([]);
  // const [district, setDistrict] = useState<DistrictProps | null>(null);
  // const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(false);
  // const [isChartsVisible, setIsChartsVisible] = useState<boolean>(false);
  // const [drawToolsVisible, setDrawToolsVisible] = useState<boolean>(false);
  // const [isFilterVisible, setIsFilterVisible] = useState<boolean>(false);
  // const [isTableVisible, setIsTableVisible] = useState<boolean>(false);
  // const [isAreaFilterVisible, setIsAreaFilterVisible] =
  //   useState<boolean>(false);
  // const [activeOption, setActiveOption] = useState(activityOptions[0]);
  // const [legend, setLegend] = useState<LegendProps>({
  //   urbanizedAreasVisible: false,
  //   communitysVisible: false,
  //   districtsVisible: true,
  //   roadBR232Visible: false,
  //   roadPE320Visible: false,
  //   roadPE365Visible: false,
  //   roadPE390Visible: false,
  //   roadPE418Visible: false,
  //   roadPavedVisible: false,
  //   roadUnpavedVisible: false,
  //   watersVisible: false,
  //   drainagesVisible: false,
  //   springsVisible: false,
  //   subBasinVisible: false,
  //   propertyDensityVisible: false,
  //   propertyVisible: true,
  //   updateLegend: (key, value) => {
  //     setLegend((prevState) => ({
  //       ...prevState,
  //       [key]: value,
  //     }));
  //   },
  // });

  const listProductiveActivityByProperty = useCallback(
    async (property_id: number, activity: number) => {
      try {
        const response = await api.get(
          `/productive-activity/property/${property_id}`,
          {
            params: { activity },
          }
        );
        return response.data;
      } catch (error) {
        toast.error("Erro ao listar atividades produtivas!");
        return [];
      }
    },
    []
  );
  const listProductiveActivityByActivity = useCallback(
    async (activity: number) => {
      try {
        const response = await api.get(`/productive-activity/activity`, {
          params: { activity },
        });
        return response.data;
      } catch (error) {
        toast.error("Erro ao listar atividades produtivas!");
        return [];
      }
    },
    []
  );

  // const listPropertyWithSelectedActivities = useCallback(
  //   async (activities: string) => {
  //     try {
  //       const response = await api.get(
  //         `/productive-activities/properties/multifunctional`,
  //         {
  //           params: { activities },
  //         }
  //       );
  //       return response.data;
  //     } catch (error) {
  //       toast.error("Erro ao listar atividades produtivas selecionadas!");
  //       return [];
  //     }
  //   },
  //   []
  // );

  const listWaterResourceByProperty = useCallback(
    async (property_id: number) => {
      try {
        const response = await api.get(
          `/water-resources/property/${property_id}`
        );
        return response.data;
      } catch (error) {
        toast.error("Erro ao listar water resource by property!");
        return [];
      }
    },
    []
  );

  // const listRecentVisitByProperty = useCallback(async (property_id: number) => {
  //   try {
  //     const response = await api.get(
  //       `/properties/${property_id}/visits/most-recent`
  //     );
  //     return response.data;
  //   } catch (error) {
  //     toast.error("Erro ao listar most recent visit by property!");
  //     return [];
  //   }
  // }, []);

  // const listUrbanizedArea = useCallback(async () => {
  //   try {
  //     const response = await api.get("/urbanized-areas");
  //     return response.data;
  //   } catch (error) {
  //     toast.error("Erro ao listar Urbanized areas!");
  //     return [];
  //   }
  // }, []);

  const listProperty = useCallback(async () => {
    try {
      const response = await api.get("/properties");
      return response.data;
    } catch (error) {
      toast.error("Erro ao listar Properties!");
      return [];
    }
  }, []);

  const listBeneficiario = useCallback(async () => {
    try {
      const response = await api.get("/beneficiaries");
      return response.data;
    } catch (error) {
      toast.error("Erro ao listar Beneficiarios!");
      return [];
    }
  }, []);

  const listWaterResouces = useCallback(async () => {
    try {
      const response = await api.get("/water-resources/properties");
      return response.data;
    } catch (error) {
      toast.error("Erro ao listar Water Resouces!");
      return [];
    }
  }, []);

  // const listWater = useCallback(async () => {
  //   try {
  //     const response = await api.get("/waters");
  //     return response.data;
  //   } catch (error) {
  //     toast.error("Erro ao listar Waters!");
  //     return [];
  //   }
  // }, []);

  // const listDrainage = useCallback(async () => {
  //   try {
  //     const response = await api.get("/drainages");
  //     return response.data;
  //   } catch (error) {
  //     toast.error("Erro ao listar Drainages!");
  //     return [];
  //   }
  // }, []);

  // const listDistrict = useCallback(async () => {
  //   try {
  //     const response = await api.get("/districts");
  //     return response.data;
  //   } catch (error) {
  //     toast.error("Erro ao listar Districts!");
  //     return [];
  //   }
  // }, []);

  // const listRoad = useCallback(async () => {
  //   try {
  //     const response = await api.get("/roads");
  //     return response.data;
  //   } catch (error) {
  //     toast.error("Erro ao listar Roads!");
  //     return [];
  //   }
  // }, []);

  // const listCommunity = useCallback(async () => {
  //   try {
  //     const response = await api.get("/communities");
  //     return response.data;
  //   } catch (error) {
  //     toast.error("Erro ao listar Communities!");
  //     return [];
  //   }
  // }, []);

  // const listSpring = useCallback(async () => {
  //   try {
  //     const response = await api.get("/springs");
  //     return response.data;
  //   } catch (error) {
  //     toast.error("Erro ao listar springs!");
  //     return [];
  //   }
  // }, []);

  // const listSubBasin = useCallback(async () => {
  //   try {
  //     const response = await api.get("/sub-basins");
  //     return response.data;
  //   } catch (error) {
  //     toast.error("Erro ao listar sub basins!");
  //     return [];
  //   }
  // }, []);

  // const listProtectionLayer = useCallback(async () => {
  //   try {
  //     const response = await api.get("/protection-layer");
  //     return response.data;
  //   } catch (error) {
  //     toast.error("Erro ao listar protection layer!");
  //     return [];
  //   }
  // }, []);

  return (
    <MapContext.Provider
      value={{
        // activeOption,
        // setActiveOption,
        // areaFilter,
        // setAreaFilter,
        // selectedYear,
        // setSelectedYear,
        // propertySizeFilter,
        // setPropertySizeFilter,
        // waterDistanceFilter,
        // setWaterDistanceFilter,
        // drawnItems,
        // setDrawnItems,
        // isFilterVisible,
        // setIsFilterVisible,
        // isTableVisible,
        // setIsTableVisible,
        // isAreaFilterVisible,
        // setIsAreaFilterVisible,
        // drawToolsVisible,
        // setDrawToolsVisible,
        // upload,
        // setUpload,
        // propertiesID,
        // setPropertiesID,
        // property,
        // setProperty,
        // district,
        // setDistrict,
        // legend,
        // isSidebarVisible,
        // setIsSidebarVisible,
        // isChartsVisible,
        // setIsChartsVisible,
        // listPropertyWithSelectedActivities,
        // listWater,
        // listDrainage,
        listProductiveActivityByProperty,
        listProductiveActivityByActivity,
        listWaterResourceByProperty,
        // listRecentVisitByProperty,
        listProperty,
        listBeneficiario,
        listWaterResouces,
        // listDistrict,
        // listRoad,
        // listUrbanizedArea,
        // listCommunity,
        // listSpring,
        // listSubBasin,
        // listProtectionLayer,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}
