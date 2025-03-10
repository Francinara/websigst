import { useEffect, useRef, useState } from "react";
import useMapa from "../../../hooks/useMapa";
import {
  AgricultureProps,
  PropertyProps,
} from "../../../contexts/MapContext/types";

import Select from "react-select";

import styles from "../styles.module.scss";

import L from "leaflet";

import { point, polygon, booleanPointInPolygon } from "@turf/turf";
import { activityAcess } from "../../../utils/constants";
import LineChart from "../Charts/LineChart";
import { ArrowLeft } from "@phosphor-icons/react";
import BarChartIntervals from "../Charts/BarChartIntervals";
import {
  CompleteProductiveActivity,
  VisibilityOptionsAgriculture,
} from "../../../utils/types";
import LegendTest from "../Charts/LegendTest";
import BarChartTest from "../Charts/BarChartTest";
import BarChartRankingTest from "../Charts/BarChartRankingTest";
import PieChartTest from "../Charts/PieChartTest";
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

export default function Agriculture() {
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState<AgricultureProps[]>([]);
  const [properties, setProperties] = useState<PropertyProps[]>([]);
  const [agriculture, setAgriculture] = useState<AgricultureProps[]>([]);
  const [ignoreEffect, setIgnoreEffect] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

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
    Array.from(new Set(agriculture?.map(({ cultura }) => cultura)))
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
        Array.from(new Set(agriculture?.map(({ cultura }) => cultura)))
      );
    }
  }, [agriculture]);

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
    const tempProperties = data.filter((agriculture) => {
      const property: PropertyProps | undefined = properties.find(
        (property) => property.id === agriculture.propriedade_id
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
            selectedOption.some((culture) => activity.cultura === culture.value)
          )
        : tempProperties;

    setAgriculture(
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
        activityAcess.agriculture
      )) as AgricultureProps[];

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
              classNamePrefix="scrollable"
              isMulti
              name="colors"
              options={options}
              className={`basic-multi-select ${styles.selectContainer}`}
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
            ref={chartRef}
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
                <div className={styles.chartCard}>
                  <p className={styles.chartTitle}>
                    Quantidade de propriedades por Cultura
                  </p>
                  <BarChartTest
                    width={148}
                    height={120}
                    marginLeft={30}
                    datas={agriculture as CompleteProductiveActivity[]}
                    selectedChart={selectedChart}
                    setSelectedChart={setSelectedChart}
                    chartName="Quantidade de propriedades por Cultura"
                    field="cultura"
                    countLogic={(items) => items.length}
                    VisibilityOptionsAgriculture={
                      VisibilityOptionsAgriculture.Property
                    }
                  />
                </div>

                <div className={styles.chartCard}>
                  <p className={styles.chartTitle}>
                    Produção Total por tipo de cultivo
                  </p>
                  <BarChartTest
                    width={148}
                    height={120}
                    marginLeft={30}
                    datas={agriculture as CompleteProductiveActivity[]}
                    selectedChart={selectedChart}
                    setSelectedChart={setSelectedChart}
                    chartName="Produção Total por tipo de cultivo"
                    field="cultura"
                    countLogic={(items) =>
                      items.reduce((acm, item) => {
                        return acm + item.producao_ano;
                      }, 0)
                    }
                    VisibilityOptionsAgriculture={
                      VisibilityOptionsAgriculture.Production
                    }
                    label="Sacas"
                  />
                </div>

                <div className={styles.chartCard}>
                  <p className={styles.chartTitle}>
                    Área de plantio por tipo de cultura
                  </p>
                  <BarChartTest
                    width={148}
                    height={120}
                    marginLeft={40}
                    datas={agriculture as CompleteProductiveActivity[]}
                    selectedChart={selectedChart}
                    setSelectedChart={setSelectedChart}
                    chartName="Área de plantio por tipo de cultura"
                    field="cultura"
                    countLogic={(items) =>
                      items.reduce((acm, item) => {
                        return acm + item.area_cultivo;
                      }, 0)
                    }
                    VisibilityOptionsAgriculture={
                      VisibilityOptionsAgriculture.CultivationArea
                    }
                    label=""
                  />
                </div>

                <div className={styles.chartCard}>
                  <p className={styles.chartTitle}>
                    Valor gerado pela comercialização de cada cultura
                  </p>
                  <BarChartTest
                    width={148}
                    height={120}
                    marginLeft={60}
                    datas={agriculture as CompleteProductiveActivity[]}
                    selectedChart={selectedChart}
                    setSelectedChart={setSelectedChart}
                    chartName="Valor gerado pela comercialização de cada cultura"
                    field="cultura"
                    countLogic={(items) =>
                      items.reduce((acm, item) => {
                        return (
                          acm +
                          item.destinacao_venda * item.valor_comercializado
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
                    datas={agriculture as CompleteProductiveActivity[]}
                    selectedChart={selectedChart}
                    field="cultura"
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
                  datas={agriculture}
                  properties={properties}
                  height={200}
                  width={300}
                  selectedChart={selectedChart}
                  setSelectedChart={setSelectedChart}
                  countKey="producao_ano"
                  label="Sacas"
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
                    datas={agriculture as CompleteProductiveActivity[]}
                    selectedChart={selectedChart}
                    setSelectedChart={setSelectedChart}
                    chartName="produção"
                    getValue={(item) => item.producao_ano}
                    VisibilityOptionsAgriculture={
                      VisibilityOptionsAgriculture.Production
                    }
                  />
                </div>

                <div className={styles.chartCard}>
                  <p className={styles.chartTitle}>
                    Intervalo da área ocupada pelo cultivo de [nome da espécie]{" "}
                    {selectedOption[0]?.value} nas propriedades
                  </p>
                  <BarChartIntervals
                    width={330}
                    height={140}
                    datas={agriculture as CompleteProductiveActivity[]}
                    selectedChart={selectedChart}
                    setSelectedChart={setSelectedChart}
                    chartName="area"
                    getValue={(item) => item.area_cultivo}
                    VisibilityOptionsAgriculture={
                      VisibilityOptionsAgriculture.CultivationArea
                    }
                  />
                </div>

                <div className={styles.chartCard}>
                  <p className={styles.chartTitle}>
                    {" "}
                    Intervalo dos valores gerado pela comercialização de{" "}
                    {selectedOption[0]?.value} nas Propriedades
                  </p>
                  <BarChartIntervals
                    width={330}
                    height={140}
                    datas={agriculture as CompleteProductiveActivity[]}
                    selectedChart={selectedChart}
                    setSelectedChart={setSelectedChart}
                    chartName="value"
                    getValue={(item) =>
                      item.destinacao_venda * item.valor_comercializado
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
                    datas={agriculture as CompleteProductiveActivity[]}
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
                    label="Sacas"
                  />
                </div>
                <div className={styles.borderBox}>
                  <p className={styles.chartTitle}>
                    Presença de sistemas de irrigação nas culturas
                  </p>

                  <PieChartTest
                    width={151}
                    height={70}
                    datas={agriculture as CompleteProductiveActivity[]}
                    selectedChart={selectedChart}
                    setSelectedChart={setSelectedChart}
                    chartName="Presença de sistemas de irrigação nas culturas"
                    districts={["Não Possui irrigação", "Possui Irrigação"]}
                    getValue={(district, item) =>
                      Number(
                        district === "Possui Irrigação"
                          ? item.irrigacao
                          : !item.irrigacao
                      )
                    }
                    label="Culturas"
                  />
                </div>
              </div>
              <div className={styles.borderBox}>
                <p className={styles.chartTitle}>
                  Produção por Data de Plantio/Colheita
                </p>
                <LineChart
                  chartRef={chartRef}
                  datas={agriculture}
                  categoryType="cultura"
                  selectedChart={selectedChart}
                  setSelectedChart={setSelectedChart}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
