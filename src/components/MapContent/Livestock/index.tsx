import { useEffect, useState } from "react";
import useMapa from "../../../hooks/useMapa";
import {
  LivestockProps,
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
import BarChartRankingTest from "../Charts/BarChartRankingTest";
import BarChartTest from "../Charts/BarChartTest";
import BarChartIntervals from "../Charts/BarChartIntervals";
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

export default function Livestock() {
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState<LivestockProps[]>([]);
  const [properties, setProperties] = useState<PropertyProps[]>([]);
  const [livestock, setLivestock] = useState<LivestockProps[]>([]);
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
    Array.from(new Set(livestock?.map(({ especie }) => especie)))
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
        Array.from(new Set(livestock?.map(({ especie }) => especie)))
      );
    }
  }, [livestock]);

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

    setLivestock(
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
        activityAcess.livestock
      )) as LivestockProps[];

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
              <div
                className={`${styles.chartGrid} ${
                  selectedOption.length === 1 ? styles.hidden : ""
                }`}
              >
                <div className={styles.chartCard}>
                  <p className={styles.chartTitle}>
                    Quantidade de Propriedades por Especie
                  </p>
                  <BarChartTest
                    width={148}
                    height={120}
                    marginLeft={30}
                    datas={livestock as CompleteProductiveActivity[]}
                    selectedChart={selectedChart}
                    setSelectedChart={setSelectedChart}
                    chartName="Quantidade de Propriedades por Especie"
                    field="especie"
                    countLogic={(items) => items.length}
                    VisibilityOptionsAgriculture={
                      VisibilityOptionsAgriculture.Property
                    }
                  />
                </div>

                <div className={styles.chartCard}>
                  <p className={styles.chartTitle}>
                    Produção pecuária total por espécie
                  </p>
                  <BarChartTest
                    width={148}
                    height={120}
                    marginLeft={30}
                    datas={livestock as CompleteProductiveActivity[]}
                    selectedChart={selectedChart}
                    setSelectedChart={setSelectedChart}
                    chartName="Produção pecuária total por espécie"
                    field="especie"
                    countLogic={(items) =>
                      items.reduce((acm, item) => {
                        return acm + item.quantidade;
                      }, 0)
                    }
                    VisibilityOptionsAgriculture={
                      VisibilityOptionsAgriculture.Production
                    }
                    label="Animias"
                  />
                </div>

                <div className={styles.chartCard}>
                  <p className={styles.chartTitle}>
                    Valor gerado pela comercialização de cada Espécie
                  </p>
                  <BarChartTest
                    width={148}
                    height={120}
                    marginLeft={60}
                    datas={livestock as CompleteProductiveActivity[]}
                    selectedChart={selectedChart}
                    setSelectedChart={setSelectedChart}
                    chartName="Valor gerado pela comercialização de cada Espécie"
                    field="especie"
                    countLogic={(items) =>
                      items.reduce((acm, item) => {
                        return (
                          acm +
                          item.destinacao_venda * item.valor_comercializacao
                        );
                      }, 0)
                    }
                    VisibilityOptionsAgriculture={
                      VisibilityOptionsAgriculture.SaleValue
                    }
                    label=""
                  />
                </div>

                <div className={styles.legendContainer}>
                  <LegendTest
                    datas={livestock as CompleteProductiveActivity[]}
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
                  Propriedades com maior produção de {selectedOption[0]?.value}
                </p>

                <BarChartRankingTest
                  datas={livestock}
                  properties={properties}
                  height={200}
                  width={300}
                  selectedChart={selectedChart}
                  setSelectedChart={setSelectedChart}
                  countKey="quantidade"
                  label="Animais"
                />
              </div>

              <div
                className={`${styles.chartGrid} ${
                  selectedOption.length === 1 ? "" : styles.hidden
                }`}
              >
                <div className={styles.chartCard}>
                  <p className={styles.chartTitle}>
                    Intervalo de produção de {selectedOption[0]?.value} nas
                    Propriedades
                  </p>
                  <BarChartIntervals
                    width={330}
                    height={140}
                    datas={livestock as CompleteProductiveActivity[]}
                    selectedChart={selectedChart}
                    setSelectedChart={setSelectedChart}
                    chartName="quantidade"
                    getValue={(item) => item.quantidade}
                    VisibilityOptionsAgriculture={
                      VisibilityOptionsAgriculture.Production
                    }
                  />
                </div>

                <div className={styles.chartCard}>
                  <p className={styles.chartTitle}>
                    Intervalo dos valores gerado pela comercialização de{" "}
                    {selectedOption[0]?.value} nas Propriedades
                  </p>
                  <BarChartIntervals
                    width={330}
                    height={140}
                    datas={livestock as CompleteProductiveActivity[]}
                    selectedChart={selectedChart}
                    setSelectedChart={setSelectedChart}
                    chartName="value"
                    getValue={(item) =>
                      item.destinacao_venda * item.valor_comercializacao
                    }
                    VisibilityOptionsAgriculture={
                      VisibilityOptionsAgriculture.SaleValue
                    }
                  />
                </div>
              </div>

              <div className={styles.pieChartContainer}>
                <div className={styles.borderBox}>
                  <p className={styles.chartTitle}>Destino da produção</p>

                  <PieChartTest
                    width={151}
                    height={70}
                    datas={livestock as CompleteProductiveActivity[]}
                    selectedChart={selectedChart}
                    setSelectedChart={setSelectedChart}
                    chartName="Destino da produção"
                    districts={["Casa", "Venda"]}
                    getValue={(district, item) =>
                      Number(
                        district === "Casa"
                          ? item.destinacao_casa
                          : item.destinacao_venda
                      )
                    }
                    label="Animais"
                  />
                </div>
                <div className={styles.borderBox}>
                  <p className={styles.chartTitle}>Tipos de Manejo</p>

                  <PieChartTest
                    width={151}
                    height={70}
                    datas={livestock as CompleteProductiveActivity[]}
                    selectedChart={selectedChart}
                    setSelectedChart={setSelectedChart}
                    chartName="Tipos de Manejo"
                    districts={[
                      "Criação Intensivo",
                      "Criação Semi Intensivo",
                      "Criação Extensivo",
                    ]}
                    getValue={(district, item) =>
                      Number(
                        district === "Criação Intensivo"
                          ? item.tipo_cricao_intensivo
                          : district === "Criação Semi Intensivo"
                          ? item.tipo_cricao_semi_intensivo
                          : item.tipo_cricao_extensivo
                      )
                    }
                  />
                </div>
                <div className={styles.borderBox}>
                  <p className={styles.chartTitle}>Aptidão</p>

                  <PieChartTest
                    width={151}
                    height={70}
                    datas={livestock as CompleteProductiveActivity[]}
                    selectedChart={selectedChart}
                    setSelectedChart={setSelectedChart}
                    chartName="Aptidão"
                    districts={["Aptidão Corte", "Aptidão Leite", "Postura"]}
                    getValue={(district, item) =>
                      Number(
                        district === "Aptidão Corte"
                          ? item.aptidao_corte
                          : district === "Aptidão Leite"
                          ? item.aptidao_leite
                          : item.aptidao_postura
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
