import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import useMapa from "../../../../../hooks/useMapa";
import { activityMap } from "../../../../../utils/constants";
import { PropertyProps } from "../../../../../contexts/MapContext/types";
import { point, polygon, booleanPointInPolygon } from "@turf/turf";
import L from "leaflet";
import WaterDistance from "./WaterDistance";
import PropertySize from "./PropertySize";
import { ArrowLeft, FadersHorizontal } from "@phosphor-icons/react";

import { useAreaFilter } from "../../../../../store/useAreaFilter";
import { useLegendStore } from "../../../../../store/useLegendStore";
import { useSelectedYearStore } from "../../../../../store/useYearFilter";
import { useFilterStore } from "../../../../../store/useFilterStore";
import { useDistrictStore } from "../../../../../store/useDistrictStore";
import { useUIStore } from "../../../../../store/useUIStore";
import { usePropertyStore } from "../../../../../store/usePropertyStore";

export default function FiltersContent() {
  const [selectedSlider, setSelectedSlider] = useState<string>("");

  const [properties, setProperties] = useState<PropertyProps[]>([]);
  const [data, setData] = useState<PropertyProps[]>([]);

  const [loading, setLoading] = useState(true);

  const { listProperty } = useMapa();

  const { isFilterVisible, updateIsFilterVisible, activeOption } = useUIStore();
  const { propertiesID } = usePropertyStore();
  const { district } = useDistrictStore();
  const areaFilter = useAreaFilter();
  const { updatePropertySizeFilter, updateWaterDistanceFilter } =
    useFilterStore();
  const { selectedYear } = useSelectedYearStore();
  const legend = useLegendStore();

  useEffect(() => {
    setLoading(true);

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

    setData(
      selectedYear
        ? tempProperties.filter(
            (property) => new Date(property.data).getFullYear() === selectedYear
          )
        : tempProperties
    );
    setLoading(false);
  }, [selectedYear, properties, areaFilter, district, activeOption]);

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);

      const data = await listProperty();
      setProperties(data);
      setLoading(false);
    }
    fetchProperties();
  }, [listProperty, setLoading, setProperties]);

  const [maxPropertySize, setMaxPropertySize] = useState<number>();
  const [minPropertySize, setMinPropertySize] = useState<number>();
  const [maxWaterDistance, setMaxWaterDistance] = useState<number>();
  const [minWaterDistance, setMinWaterDistance] = useState<number>();

  useEffect(() => {
    const maxPropertySize = Math.ceil(
      Math.max(...new Set(data.map((item) => item.area)))
    );
    const minPropertySize = Math.floor(
      Math.min(...new Set(data.map((item) => item.area)))
    );

    setMaxPropertySize(maxPropertySize);
    setMinPropertySize(minPropertySize);
    updatePropertySizeFilter([minPropertySize, maxPropertySize]);

    const maxWaterDistance = Math.ceil(
      Math.max(...new Set(data.map((item) => item.water_distance))) / 1000
    );
    const minWaterDistance = Math.floor(
      Math.min(...new Set(data.map((item) => item.water_distance))) / 1000
    );
    setMaxWaterDistance(maxWaterDistance);
    setMinWaterDistance(minWaterDistance);
    updateWaterDistanceFilter([minWaterDistance, maxWaterDistance]);
  }, [data]);

  if (!isFilterVisible) return null;

  return (
    <div className={styles.container}>
      {propertiesID.length < 1 ||
      (!legend.propertyDensityVisible && !legend.propertyVisible) ? (
        <div className={styles.noProperties}>
          <FadersHorizontal
            size={60}
            weight="duotone"
            className={styles.icon}
          />
          <h2>Nenhuma propriedade selecionada</h2>
          <p>
            Clique em uma área do mapa para visualizar informações sobre as
            propriedades disponíveis.
          </p>
        </div>
      ) : (
        <>
          {loading && (
            <div className={styles.loadingOverlay}>
              <div className={styles.loaderCircle}></div>
            </div>
          )}
          <div className={styles.filterHeader}>
            <button onClick={() => updateIsFilterVisible(!isFilterVisible)}>
              <ArrowLeft size={16} />
            </button>

            <h2>Filtro</h2>
          </div>
          <PropertySize
            datas={data}
            min={minPropertySize}
            max={maxPropertySize}
            selectedSlider={selectedSlider}
            setSelectedSlider={setSelectedSlider}
          />
          <WaterDistance
            datas={data}
            min={minWaterDistance}
            max={maxWaterDistance}
            selectedSlider={selectedSlider}
            setSelectedSlider={setSelectedSlider}
          />
        </>
      )}
    </div>
  );
}
