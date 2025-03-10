import { useEffect, useMemo, useRef, useState } from "react";
import useMapa from "../../../hooks/useMapa";
import {
  BeneficiarioProps,
  PropertyProps,
  WaterResourceProps,
} from "../../../contexts/MapContext/types";

import Select from "react-select";

import styles from "../styles.module.scss";

import L from "leaflet";

import { point, polygon, booleanPointInPolygon } from "@turf/turf";
import { activityMap } from "../../../utils/constants";
import { ArrowLeft } from "@phosphor-icons/react";
import BarChartTest from "../Charts/BarChartTest";
import {
  CompleteProductiveActivity,
  VisibilityOptionsAgriculture,
} from "../../../utils/types";
import PieChartTest from "../Charts/PieChartTest";
import LegendTest from "../Charts/LegendTest";
import BarChartPercentage from "../Charts/BarChartPercentage";
import {
  filterByPropertySize,
  filterByWaterDistance,
} from "../../../utils/filterUtils";
import BarChartIntervals from "../Charts/BarChartIntervals";
import { useAreaFilter } from "../../../store/useAreaFilter";
import { useSelectedYearStore } from "../../../store/useYearFilter";
import { useFilterStore } from "../../../store/useFilterStore";
import { useDistrictStore } from "../../../store/useDistrictStore";
import { usePropertyStore } from "../../../store/usePropertyStore";
import { useUIStore } from "../../../store/useUIStore";
import { useBeneficiaries } from "../../../hooks/useBeneficiaries";
import { BeneficiariesProps } from "../../../services/beneficiaries/beneficiariesApi";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const chartRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<PropertyProps[]>([]);
  const [properties, setProperties] = useState<PropertyProps[]>([]);
  const [dataWR, setDataWR] = useState<WaterResourceProps[]>([]);
  const [waterResouces, setWaterResouces] = useState<WaterResourceProps[]>([]);
  const [beneficiarios, setBeneficiarios] = useState<
    BeneficiariesProps[] | undefined
  >([]);
  const { data: beneficiaries } = useBeneficiaries();

  const [ignoreEffect, setIgnoreEffect] = useState(false);

  const { listProperty, listProductiveActivityByActivity, listWaterResouces } =
    useMapa();

  const areaFilter = useAreaFilter();
  const {
    isFilterVisible,
    isChartsVisible,
    updateIsChartsVisible,
    activeOption,
  } = useUIStore();
  const { updatePropertyID } = usePropertyStore();
  const { district } = useDistrictStore();
  const { propertySizeFilter, waterDistanceFilter } = useFilterStore();
  const { selectedYear } = useSelectedYearStore();

  const [selectedChart, setSelectedChart] = useState<string>("");

  const [activityTypes, setActivityTypes] = useState(
    Array.from(new Set(properties?.map(({ distrito }) => distrito)))
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
        Array.from(new Set(properties?.map(({ distrito }) => distrito)))
      );
    }
  }, [properties]);

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
    const entry = Object.entries(activityMap)
      .slice(1, -2)
      .find(([, value]) => value === activeOption.value);

    const tempProperties = data
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
      })
      .filter((property) =>
        isFilterVisible
          ? filterByPropertySize(property, propertySizeFilter) &&
            filterByWaterDistance(property, waterDistanceFilter)
          : true
      );

    const tempPropertiesCategoryFilter =
      selectedOption.length > 0
        ? tempProperties.filter((property) =>
            selectedOption.some(
              (district) => property.distrito === district.value
            )
          )
        : tempProperties;

    setProperties(
      selectedYear
        ? tempPropertiesCategoryFilter.filter(
            (property) => new Date(property.data).getFullYear() === selectedYear
          )
        : tempPropertiesCategoryFilter
    );
  }, [
    activeOption,
    selectedOption,
    selectedYear,
    data,
    areaFilter,
    district,
    updatePropertyID,
    propertySizeFilter,
    waterDistanceFilter,
    isFilterVisible,
  ]);

  useEffect(() => {
    setWaterResouces(
      dataWR.filter((wr) =>
        properties.some((item) => wr.propriedade_id === item.id)
      )
    );
  }, [properties, dataWR]);

  useEffect(() => {
    setBeneficiarios(
      beneficiaries?.filter((beneficiario) =>
        properties.some((item) => beneficiario.id === item.beneficiario_id)
      )
    );
  }, [properties, beneficiaries]);

  useEffect(() => {
    async function fetchProperties() {
      const propertieRequests = await listProperty();
      setProperties(propertieRequests);
      setData(propertieRequests);

      const waterResourceRequests = await listWaterResouces();
      setDataWR(waterResourceRequests);
    }
    fetchProperties();
  }, [listProperty, listProductiveActivityByActivity, listWaterResouces]);

  const field = "activity";
  const processActivityData = (data: PropertyProps[]) => {
    const activityLabels: Record<string, string> = {
      agricultura: "Agricultura",
      pecuaria: "Pecuária",
      aquicultura: "Aquicultura",
      artesanato: "Artesanato",
      apicultura: "Apicultura",
      outras_atividades: "Outras Atividades",
      sem_atividade: "Sem Atividade",
    };

    return data.flatMap((item) => {
      const activities = Object.keys(activityLabels).filter(
        (key) => key !== "sem_atividade" && item[key as keyof PropertyProps]
      );

      return activities.length
        ? activities.map((activity) => ({
            ...item,
            activity: activityLabels[activity],
          }))
        : { ...item, activity: activityLabels["sem_atividade"] };
    });
  };

  const processBeneficiarioData = (data: BeneficiarioProps[] | undefined) => {
    return data?.map((beneficiario) => {
      const matchingProperty = properties.find(
        (item) => beneficiario.id === item.beneficiario_id
      );

      if (matchingProperty) {
        return {
          ...beneficiario,
          propriedade_id: matchingProperty.id,
          tipo_credito_rural: beneficiario.tipo_credito_rural ?? "não possui",
        };
      }
      return {
        ...beneficiario,
        tipo_credito_rural: beneficiario.tipo_credito_rural ?? "não possui",
      };
    });
  };

  const processedData = useMemo(
    () => processActivityData(properties),
    [properties]
  );
  const processedDataBeneficiarios = useMemo(
    () => processBeneficiarioData(beneficiarios),
    [beneficiarios]
  );

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
              name="districts"
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
            ref={chartRef}
            className={`${styles.chartContainer} ${
              isFilterVisible ? styles.heightWhithFilter : styles.height
            } scrollable-content`}
          >
            {" "}
            <div className={styles.chartContent}>
              <div className={styles.pieChartContainer}>
                <div className={styles.borderBox}>
                  <p className={styles.chartTitle}>
                    Quantidade de Propriedades por Distritos
                  </p>

                  <PieChartTest
                    width={151}
                    height={70}
                    datas={properties as CompleteProductiveActivity[]}
                    selectedChart={selectedChart}
                    setSelectedChart={setSelectedChart}
                    chartName="Quantidade de Propriedades por Distritos"
                    districts={[
                      ...new Set(data.map((property) => property.distrito)),
                    ]}
                    getValue={(district, item) =>
                      Number(item.distrito === district ? 1 : 0)
                    }
                    id={"id"}
                  />
                </div>
                <div className={styles.borderBox}>
                  <p className={styles.chartTitle}>Acesso ao crédito Rural</p>

                  <PieChartTest
                    width={151}
                    height={70}
                    datas={
                      processedDataBeneficiarios as CompleteProductiveActivity[]
                    }
                    selectedChart={selectedChart}
                    setSelectedChart={setSelectedChart}
                    chartName="Acesso ao crédito Rural"
                    districts={[
                      "Não Possui Crédito Rural",
                      "Possui Crédito Rural",
                    ]}
                    getValue={(district, item) =>
                      Number(
                        district === "Possui Crédito Rural"
                          ? item.credito_rural
                          : !item.credito_rural
                      )
                    }
                    label="Famílias"
                  />
                </div>
              </div>

              <div className={styles.chartGrid}>
                <div className={styles.chartCard}>
                  <p className={styles.chartTitle}>
                    Quantidade de propriedades por atividade produtiva
                  </p>
                  <BarChartTest
                    width={330}
                    height={140}
                    marginLeft={30}
                    datas={processedData as CompleteProductiveActivity[]}
                    selectedChart={selectedChart}
                    setSelectedChart={setSelectedChart}
                    chartName="Quantidade de propriedades por atividade produtiva"
                    field={field}
                    countLogic={(items) => items.length}
                    VisibilityOptionsAgriculture={
                      VisibilityOptionsAgriculture.Property
                    }
                    id={"id"}
                  />
                </div>

                <div className={styles.legendContainer}>
                  <LegendTest
                    datas={processedData as CompleteProductiveActivity[]}
                    selectedChart={selectedChart}
                    field="activity"
                    id="id"
                  />
                </div>
              </div>

              <div className={styles.chartGrid}>
                <div className={styles.chartCard}>
                  <p className={styles.chartTitle}>
                    Distribuição da renda familiar dos produtores
                  </p>
                  <BarChartIntervals
                    width={330}
                    height={140}
                    datas={
                      processedDataBeneficiarios as CompleteProductiveActivity[]
                    }
                    selectedChart={selectedChart}
                    setSelectedChart={setSelectedChart}
                    chartName="Distribuição da renda familiar dos produtores"
                    getValue={(item) => item.renda_familiar}
                    VisibilityOptionsAgriculture={
                      VisibilityOptionsAgriculture.SaleValue
                    }
                    label="Famílias"
                  />
                </div>
              </div>

              <div className={styles.borderBox}>
                <p className={styles.chartTitle}>
                  Distribuição percentual de recursos hídricos em propriedades
                </p>
                <BarChartPercentage
                  datas={waterResouces}
                  height={150}
                  chartRef={chartRef}
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
