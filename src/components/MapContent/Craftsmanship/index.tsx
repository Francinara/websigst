import { useEffect, useState } from "react";
import useMapa from "../../../hooks/useMapa";
import {
  CraftsmanshipProps,
  PropertyProps,
} from "../../../contexts/MapContext/types";

import Select from "react-select";

import styles from "../styles.module.scss";

import L from "leaflet";

import { point, polygon, booleanPointInPolygon } from "@turf/turf";
import { activityAcess } from "../../../utils/constants";
import { ArrowLeft } from "@phosphor-icons/react";
import PieChartTest from "../Charts/PieChartTest";
import {
  CompleteProductiveActivity,
  VisibilityOptionsAgriculture,
} from "../../../utils/types";
import BarChartTest from "../Charts/BarChartTest";
import {
  filterByPropertySize,
  filterByWaterDistance,
} from "../../../utils/filterUtils";
import LegendTest from "../Charts/LegendTest";
import { useAreaFilter } from "../../../store/useAreaFilter";
import { useSelectedYearStore } from "../../../store/useYearFilter";
import { useFilterStore } from "../../../store/useFilterStore";
import { useDistrictStore } from "../../../store/useDistrictStore";
import { usePropertyStore } from "../../../store/usePropertyStore";
import { useUIStore } from "../../../store/useUIStore";

export default function Craftsmanship() {
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState<CraftsmanshipProps[]>([]);
  const [properties, setProperties] = useState<PropertyProps[]>([]);
  const [craftsmanship, setCraftsmanship] = useState<CraftsmanshipProps[]>([]);
  const [ignoreEffect, setIgnoreEffect] = useState(false);

  const { listProperty, listProductiveActivityByActivity } = useMapa();

  const { isFilterVisible, isChartsVisible, updateIsChartsVisible } =
    useUIStore();

  const areaFilter = useAreaFilter();
  const { updatePropertyID } = usePropertyStore();
  const { district } = useDistrictStore();
  const { propertySizeFilter, waterDistanceFilter } = useFilterStore();
  const { selectedYear } = useSelectedYearStore();

  const [selectedChart, setSelectedChart] = useState<string>("");

  const [activityTypes, setActivityTypes] = useState(
    Array.from(new Set(craftsmanship?.map(({ produto }) => produto)))
  );

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
    if (ignoreEffect) {
      setIgnoreEffect(false);
      return;
    } else {
      setActivityTypes(
        Array.from(new Set(craftsmanship?.map(({ produto }) => produto)))
      );
    }
  }, [craftsmanship]);

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
    const tempProperties = data.filter((craftsmanship) => {
      const property: PropertyProps | undefined = properties.find(
        (property) => property.id === craftsmanship.propriedade_id
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
            selectedOption.some((culture) => activity.produto === culture.value)
          )
        : tempProperties;

    setCraftsmanship(
      selectedYear
        ? tempPropertiesCategoryFilter.filter(
            (craftsmanship) =>
              new Date(craftsmanship.data).getFullYear() === selectedYear
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
        activityAcess.craftsmanship
      )) as CraftsmanshipProps[];

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
                setIgnoreEffect(true);
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
            {" "}
            <div className={styles.chartContent}>
              <div className={styles.chartGrid}>
                <div className={styles.chartCard}>
                  <p className={styles.chartTitle}>
                    Quantidade de Propriedades por Produto
                  </p>
                  <BarChartTest
                    width={330}
                    height={140}
                    marginLeft={30}
                    datas={craftsmanship as CompleteProductiveActivity[]}
                    selectedChart={selectedChart}
                    setSelectedChart={setSelectedChart}
                    chartName="Quantidade de Propriedades por Produto"
                    field="produto"
                    countLogic={(items) => items.length}
                    VisibilityOptionsAgriculture={
                      VisibilityOptionsAgriculture.Property
                    }
                  />
                </div>

                <div className={styles.legendContainer}>
                  <LegendTest
                    datas={craftsmanship as CompleteProductiveActivity[]}
                    selectedChart={selectedChart}
                    field="produto"
                  />
                </div>
              </div>

              <div className={styles.pieChartContainer}>
                <div className={styles.borderBox}>
                  <p className={styles.chartTitle}>
                    Locais de comercialização dos Produtos
                  </p>

                  <PieChartTest
                    width={151}
                    height={70}
                    datas={craftsmanship as CompleteProductiveActivity[]}
                    selectedChart={selectedChart}
                    setSelectedChart={setSelectedChart}
                    chartName="Locais de comercialização dos Produtos"
                    districts={[
                      ...new Set(
                        data.map(
                          (craftsmanship) => craftsmanship.destinacao_valor
                        )
                      ),
                    ]}
                    getValue={(district, item) =>
                      Number(item.destinacao_valor === district ? 1 : 0)
                    }
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
