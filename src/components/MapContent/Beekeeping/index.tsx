import { useEffect, useState } from "react";
import useMapa from "../../../hooks/useMapa";
import { PropertyProps } from "../../../contexts/MapContext/types";

import Select from "react-select";

import styles from "../styles.module.scss";

import L from "leaflet";

import { point, polygon, booleanPointInPolygon } from "@turf/turf";
import { activityAcess } from "../../../utils/constants";
import {
  CompleteProductiveActivity,
  newDataBeekeepingProps,
  VisibilityOptionsAgriculture,
} from "../../../utils/types";
import { ArrowLeft } from "@phosphor-icons/react";
import PieChartTest from "../Charts/PieChartTest";
import BarChartRankingTest from "../Charts/BarChartRankingTest";
import BarChartTest from "../Charts/BarChartTest";
import LegendTest from "../Charts/LegendTest";
import BarChartIntervals from "../Charts/BarChartIntervals";
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

export default function Beekeeping() {
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState<newDataBeekeepingProps[]>([]);
  const [properties, setProperties] = useState<PropertyProps[]>([]);
  const [beekeeping, setBeekeeping] = useState<newDataBeekeepingProps[]>([]);
  const [ignoreEffect, setIgnoreEffect] = useState(false);

  const areaFilter = useAreaFilter();

  const { listProperty, listProductiveActivityByActivity } = useMapa();

  const { isFilterVisible, isChartsVisible, updateIsChartsVisible } =
    useUIStore();

  const { updatePropertyID } = usePropertyStore();

  const { district } = useDistrictStore();

  const { propertySizeFilter, waterDistanceFilter } = useFilterStore();

  const { selectedYear } = useSelectedYearStore();

  const [selectedChart, setSelectedChart] = useState<string>("");

  const [activityTypes, setActivityTypes] = useState(
    Array.from(new Set(beekeeping?.map(({ especie }) => especie)))
  );

  const options = activityTypes.map((type) => ({
    value: type,
    label: type,
  }));

  const [selectedOption, setSelectedOption] = useState<
    Array<{ value: string; label: string }>
  >([]);

  useEffect(() => {
    if (ignoreEffect) {
      setIgnoreEffect(false);
      return;
    } else {
      setActivityTypes(
        Array.from(new Set(beekeeping?.map(({ especie }) => especie)))
      );
    }
  }, [beekeeping]);

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
            selectedOption.some((culture) => activity.especie === culture.value)
          )
        : tempProperties;

    setBeekeeping(
      selectedYear
        ? tempPropertiesCategoryFilter.filter(
            (beekeeping) =>
              new Date(beekeeping.data).getFullYear() === selectedYear
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
        activityAcess.beekeeping
      )) as newDataBeekeepingProps[];

      const newData: newDataBeekeepingProps[] = activityRequests.flatMap(
        (item) => {
          const resultado = [];

          if (item.com_ferrao) {
            resultado.push({ ...item, especie: "Com Ferrão" });
          }

          if (item.sem_ferrao) {
            resultado.push({ ...item, especie: "Sem Ferrão" });
          }

          return resultado;
        }
      );
      setData(newData);
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
            <div className={styles.chartContent}>
              <div
                className={`${styles.chartGrid} ${
                  selectedOption.length === 1 ? styles.hidden : ""
                }`}
              >
                <div className={`${styles.chartCard} w-[172px]`}>
                  <p className={styles.chartTitle}>
                    Quantidade de Propriedades por Tipo de Abelha
                  </p>
                  <BarChartTest
                    width={148}
                    height={120}
                    marginLeft={30}
                    datas={beekeeping as CompleteProductiveActivity[]}
                    selectedChart={selectedChart}
                    setSelectedChart={setSelectedChart}
                    chartName="Quantidade de Propriedades por Tipo de Abelha"
                    field="especie"
                    countLogic={(items) => items.length}
                    VisibilityOptionsAgriculture={
                      VisibilityOptionsAgriculture.Property
                    }
                  />
                </div>

                <div className={`${styles.chartCard} w-[172px]`}>
                  <p className={styles.chartTitle}>
                    Nª de Colmeias por Tipo de Abelha
                  </p>
                  <BarChartTest
                    width={148}
                    height={120}
                    marginLeft={30}
                    datas={beekeeping as CompleteProductiveActivity[]}
                    selectedChart={selectedChart}
                    setSelectedChart={setSelectedChart}
                    chartName="Nª de Colmeias por Tipo de Abelha"
                    field="especie"
                    countLogic={(items) =>
                      items.reduce((acm, item) => {
                        return acm + item.n_colmeias;
                      }, 0)
                    }
                    VisibilityOptionsAgriculture={
                      VisibilityOptionsAgriculture.Property
                    }
                    label="Colmeias"
                  />
                </div>

                <div className={styles.legendContainer}>
                  <LegendTest
                    datas={beekeeping as CompleteProductiveActivity[]}
                    selectedChart={selectedChart}
                    field="especie"
                  />
                </div>
              </div>

              <div
                className={`${styles.rankingContainer} ${
                  selectedOption.length === 1 ? "" : styles.hidden
                }`}
              >
                <p className={styles.chartTitle}>
                  Propriedades com maior número de colmeias - Abelhas{" "}
                  {selectedOption[0]?.value}
                </p>

                <BarChartRankingTest
                  datas={beekeeping}
                  properties={properties}
                  height={200}
                  width={300}
                  selectedChart={selectedChart}
                  setSelectedChart={setSelectedChart}
                  countKey="n_colmeias"
                  label="Colmeias"
                />
              </div>

              <div
                className={`${styles.chartGrid} ${
                  selectedOption.length === 1 ? "" : styles.hidden
                }`}
              >
                <div className={styles.chartCard}>
                  <p className={styles.chartTitle}>
                    Distribuição de colmeias por propriedade - Abelhas{" "}
                    {selectedOption[0]?.value}
                  </p>
                  <BarChartIntervals
                    width={330}
                    height={140}
                    datas={beekeeping as CompleteProductiveActivity[]}
                    selectedChart={selectedChart}
                    setSelectedChart={setSelectedChart}
                    chartName="Distribuição de colmeias por Propriedade"
                    getValue={(item) => item.n_colmeias}
                    VisibilityOptionsAgriculture={
                      VisibilityOptionsAgriculture.Production
                    }
                  />
                </div>
              </div>

              <div className={styles.pieChartContainer}>
                <div className={styles.borderBox}>
                  <p className={styles.chartTitle}>
                    Locais de comercialização do Mel
                  </p>

                  <PieChartTest
                    width={151}
                    height={70}
                    datas={beekeeping as CompleteProductiveActivity[]}
                    selectedChart={selectedChart}
                    setSelectedChart={setSelectedChart}
                    chartName="Locais de comercialização do Mel"
                    districts={[
                      ...new Set(
                        data.map((beekeeping) => beekeeping.destinacao_mel)
                      ),
                    ]}
                    getValue={(district, item) =>
                      Number(item.destinacao_mel === district ? 1 : 0)
                    }
                    label="Kg"
                  />
                </div>
                <div className={styles.borderBox}>
                  <p className={styles.chartTitle}>
                    Tipos de manejo de abelhas
                  </p>

                  <PieChartTest
                    width={151}
                    height={70}
                    datas={beekeeping as CompleteProductiveActivity[]}
                    selectedChart={selectedChart}
                    setSelectedChart={setSelectedChart}
                    chartName="Tipos de manejo de abelhas nas propriedades"
                    districts={["Criação", "Extrativismo"]}
                    getValue={(district, item) =>
                      Number(
                        district === "Criação"
                          ? item.tipo_criacao
                          : item.tipo_extrativismo
                      )
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
