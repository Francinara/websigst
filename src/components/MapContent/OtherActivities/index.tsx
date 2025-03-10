import { useEffect, useState } from "react";
import useMapa from "../../../hooks/useMapa";
import {
  OtherActivitiesProps,
  PropertyProps,
} from "../../../contexts/MapContext/types";

import Select from "react-select";

import styles from "../styles.module.scss";

import L from "leaflet";

import { point, polygon, booleanPointInPolygon } from "@turf/turf";
import { activityAcess } from "../../../utils/constants";
import { ArrowLeft } from "@phosphor-icons/react";
import BarChartTest from "../Charts/BarChartTest";
import {
  CompleteProductiveActivity,
  VisibilityOptionsAgriculture,
} from "../../../utils/types";
import LegendTest from "../Charts/LegendTest";
import {
  filterByPropertySize,
  filterByWaterDistance,
} from "../../../utils/filterUtils";
import { useAreaFilter } from "../../../store/useAreaFilter";
import { useSelectedYearStore } from "../../../store/useYearFilter";
import { useFilterStore } from "../../../store/useFilterStore";
import { useDistrictStore } from "../../../store/useDistrictStore";
import { usePropertyStore } from "../../../store/usePropertyStore";
import { useUIStore } from "../../../store/useUIStore";

export default function OtherActivities() {
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState<OtherActivitiesProps[]>([]);
  const [properties, setProperties] = useState<PropertyProps[]>([]);
  const [otherActivities, setOtherActivities] = useState<
    OtherActivitiesProps[]
  >([]);

  const areaFilter = useAreaFilter();

  const { listProperty, listProductiveActivityByActivity } = useMapa();

  const { isFilterVisible, isChartsVisible, updateIsChartsVisible } =
    useUIStore();

  const { updatePropertyID } = usePropertyStore();

  const { district } = useDistrictStore();

  const { propertySizeFilter, waterDistanceFilter } = useFilterStore();

  const { selectedYear } = useSelectedYearStore();

  const [selectedChart, setSelectedChart] = useState<string>("");

  const activityTypes = Array.from(new Set(data?.map(({ tipo }) => tipo)));

  const options = activityTypes
    .map((type) => ({
      value: type,
      label: type,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const [selectedOption, setSelectedOption] = useState<
    Array<{ value: string; label: string }>
  >([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    setSelectedChart("");
    setSelectedOption([]);
  }, [
    selectedYear,
    areaFilter,
    district,
    propertySizeFilter,
    waterDistanceFilter,
  ]);

  useEffect(() => {
    const tempProperties = data.filter((otherActivities) => {
      const property: PropertyProps | undefined = properties.find(
        (property) => property.id === otherActivities.propriedade_id
      );

      if (
        property &&
        (isFilterVisible
          ? filterByPropertySize(property, propertySizeFilter) &&
            filterByWaterDistance(property, waterDistanceFilter)
          : true)
      ) {
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
      }
    });

    const tempPropertiesCategoryFilter =
      selectedOption.length > 0
        ? tempProperties.filter((activity) =>
            selectedOption.some((culture) => activity.tipo === culture.value)
          )
        : tempProperties;

    setOtherActivities(
      selectedYear
        ? tempPropertiesCategoryFilter.filter(
            (otherActivities) =>
              new Date(otherActivities.data).getFullYear() === selectedYear
          )
        : tempPropertiesCategoryFilter
    );
  }, [
    selectedYear,
    data,
    areaFilter,
    district,
    updatePropertyID,
    properties,
    selectedOption,
    propertySizeFilter,
    waterDistanceFilter,
    isFilterVisible,
  ]);

  useEffect(() => {
    async function fetchProperties() {
      const propertieRequests = await listProperty();
      setProperties(propertieRequests);

      const activityRequests = (await listProductiveActivityByActivity(
        activityAcess.other_activities
      )) as OtherActivitiesProps[];

      setData(activityRequests);
    }

    fetchProperties();
  }, [listProperty, listProductiveActivityByActivity]);

  return (
    <>
      {loading ? (
        <div className={styles.loadingOverlay}>
          <div className={styles.loaderCircle}></div>
        </div>
      ) : (
        <>
          <header className={styles.container}>
            <div className={styles.headerContent}>
              <button onClick={() => updateIsChartsVisible(!isChartsVisible)}>
                <ArrowLeft size={18} />
              </button>

              <h2> Gráficos</h2>
            </div>

            <Select
              value={selectedOption}
              isMulti
              name="colors"
              options={options}
              className={`basic-multi-select ${styles.selectContainer}`}
              classNamePrefix="scrollable"
              onChange={(option) => {
                setSelectedChart("select");
                setSelectedOption(
                  option as {
                    value: string;
                    label: string;
                  }[]
                );
              }}
            />
          </header>

          <div
            className={`${styles.chartContainer} ${
              isFilterVisible ? styles.heightWhithFilter : styles.height
            } scrollable-content`}
          >
            <div className={styles.chartContent}>
              <div className={styles.chartGrid}>
                <div className={styles.chartCard}>
                  <p className={styles.chartTitle}>
                    Quantidade de Propriedades por Atividade
                  </p>
                  <BarChartTest
                    width={330}
                    height={140}
                    marginLeft={30}
                    datas={otherActivities as CompleteProductiveActivity[]}
                    selectedChart={selectedChart}
                    setSelectedChart={setSelectedChart}
                    chartName="Quantidade de Propriedades por Atividade"
                    field="tipo"
                    countLogic={(items) => items.length}
                    VisibilityOptionsAgriculture={
                      VisibilityOptionsAgriculture.Property
                    }
                  />
                </div>

                <div className={styles.legendContainer}>
                  <LegendTest
                    datas={otherActivities as CompleteProductiveActivity[]}
                    selectedChart={selectedChart}
                    field="tipo"
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
