import { DistrictLayer } from "./DistrictLayer";
import { ProtectionLayer } from "./ProtectionLayer";
import { RoadLayer } from "./RoadLayer";
import { SpringLayer } from "./SpringLayer";
import { SubBasinLayer } from "./SubBasinLayer";
import { UrbanizedAreaLayer } from "./UrbanizedAreaLayer";
import { WaterLayer } from "./WaterLayer";
import { PropertyLayer } from "./PropertyLayer";

import L from "leaflet";

import { PropertyProps } from "../../../contexts/MapContext/types";
import { useEffect, useState } from "react";
import useMapa from "../../../hooks/useMapa";
import { CommunityTextLayer } from "./CommunityTextLayer";
import { PropertiesHeatmapLayer } from "./PropertiesHeatmapLayer";
import {
  activityMap,
  legendItems,
  LegendKeys,
  roadItems,
} from "../../../utils/constants";
import { DrainageLayer } from "./DrainageLayer";
import { point, polygon, booleanPointInPolygon } from "@turf/turf";
import { useAreaFilter } from "../../../store/useAreaFilter";
import { useLegendStore } from "../../../store/useLegendStore";
import { useSelectedYearStore } from "../../../store/useYearFilter";
import { useDistrictStore } from "../../../store/useDistrictStore";
import { usePropertyStore } from "../../../store/usePropertyStore";
import { useUIStore } from "../../../store/useUIStore";

interface LegendLayersProps {
  setLoading: (loading: boolean) => void;
}

export function Layers({ setLoading }: LegendLayersProps) {
  const [properties, setProperties] = useState<PropertyProps[]>([]);

  const areaFilter = useAreaFilter();
  const { listProperty } = useMapa();
  const { isSidebarVisible, activeOption } = useUIStore();
  const { propertiesID, updatePropertyID } = usePropertyStore();
  const { district } = useDistrictStore();
  const { selectedYear } = useSelectedYearStore();

  const {
    urbanizedAreasVisible,
    communitysVisible,
    districtsVisible,
    roadBR232Visible,
    roadPE320Visible,
    roadPE365Visible,
    roadPE390Visible,
    roadPE418Visible,
    roadPavedVisible,
    roadUnpavedVisible,
    watersVisible,
    drainagesVisible,
    springsVisible,
    subBasinVisible,
    propertyDensityVisible,
    propertyVisible,
  } = useLegendStore();

  useEffect(() => {
    const entry = Object.entries(activityMap)
      .slice(1, -2)
      .find(([, value]) => value === activeOption.value);

    const tempProperties = properties
      .filter((propriedade) =>
        entry ? propriedade[entry[0] as keyof PropertyProps] : propriedade
      )
      .filter((property) => {
        let filterByRadius;
        let filterByDistrict;

        const radiusFilter =
          areaFilter.lat != 0 && areaFilter.lng != 0 && areaFilter.radius != 0;
        const districtFilter = district && district.geojson;

        let doFilter: boolean | undefined = true;

        if (radiusFilter) {
          const centerPoint = L.latLng(areaFilter.lat, areaFilter.lng);
          const currentPoint = L.latLng(property.lat, property.lng);

          filterByRadius =
            centerPoint.distanceTo(currentPoint) / 1000 < areaFilter.radius;
        }
        if (districtFilter) {
          const pt = point([property.lng, property.lat]);
          const poly = polygon(
            JSON.parse(district.geojson).geometries[0].coordinates[0]
          );
          filterByDistrict = booleanPointInPolygon(pt, poly);
        }

        if (districtFilter && radiusFilter) {
          doFilter = filterByDistrict && filterByRadius;
        } else if (districtFilter && !radiusFilter) {
          doFilter = filterByDistrict;
        } else if (radiusFilter && !districtFilter) {
          doFilter = filterByRadius;
        }

        return doFilter;
      });

    const filteredProperties = selectedYear
      ? tempProperties.filter(
          (property) => new Date(property.data).getFullYear() === selectedYear
        )
      : tempProperties;

    updatePropertyID(filteredProperties.map((property) => property.id));
  }, [
    selectedYear,
    properties,
    updatePropertyID,
    areaFilter,
    district,
    activeOption,
    isSidebarVisible,
  ]);

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);

      const data = await listProperty();
      updatePropertyID(data.map((propriedade) => propriedade.id));
      setProperties(data);
      setLoading(false);
    }
    fetchProperties();
  }, [listProperty, setLoading, setProperties, updatePropertyID]);

  function getColorByLabel(label: string) {
    let item: { label: string; color: string; key: LegendKeys } | undefined =
      legendItems.find((legendItem) => legendItem.label === label);
    if (!item) {
      item = roadItems.find((roadItem) => roadItem.label === label);
    }

    return item ? item.color : "transparent";
  }

  const propriedadesFiltradas = properties.filter((property) =>
    propertiesID.includes(property.id)
  );

  const heatmapPropertiesPoints: [number, number][] = propriedadesFiltradas.map(
    (property) => [property.lat, property.lng]
  ) as [number, number][];

  return (
    <>
      <ProtectionLayer />
      {propertyDensityVisible && (
        <PropertiesHeatmapLayer points={heatmapPropertiesPoints} />
      )}
      {propertyVisible && <PropertyLayer properties={properties} />}
      {watersVisible && <WaterLayer color={getColorByLabel("Massas D'água")} />}
      {drainagesVisible && (
        <DrainageLayer color={getColorByLabel("Drenagens")} />
      )}
      {urbanizedAreasVisible && <UrbanizedAreaLayer />}
      {springsVisible && <SpringLayer color={getColorByLabel("Nascentes")} />}
      {subBasinVisible && (
        <SubBasinLayer color={getColorByLabel("Sub-bacias")} />
      )}
      {roadBR232Visible && (
        <RoadLayer name="br_232" color={getColorByLabel("BR-232")} />
      )}
      {roadPE320Visible && (
        <RoadLayer name="pe_320" color={getColorByLabel("PE-320")} />
      )}
      {roadPE365Visible && (
        <RoadLayer name="pe_365" color={getColorByLabel("PE-365")} />
      )}
      {roadPE390Visible && (
        <RoadLayer name="pe_390" color={getColorByLabel("PE-390")} />
      )}
      {roadPE418Visible && (
        <RoadLayer name="pe_418" color={getColorByLabel("PE-418")} />
      )}
      {roadPavedVisible && (
        <RoadLayer
          name="com_pavimentacao"
          color={getColorByLabel("Pavimentadas")}
        />
      )}
      {roadUnpavedVisible && (
        <RoadLayer
          name="sem_pavimentacao"
          color={getColorByLabel("Não pavimentadas")}
        />
      )}
      {communitysVisible && (
        <CommunityTextLayer color={getColorByLabel("Comunidades")} />
      )}
      {districtsVisible && (
        <DistrictLayer color={getColorByLabel("Distritos")} />
      )}
    </>
  );
}
