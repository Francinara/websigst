import { useEffect, useState } from "react";
import useMapa from "../../../../../hooks/useMapa";

import { point, polygon, booleanPointInPolygon } from "@turf/turf";
import L from "leaflet";
import { activityMap } from "../../../../../utils/constants";

import Select, { StylesConfig, GroupBase } from "react-select";
import { useAreaFilter } from "../../../../../store/useAreaFilter";
import { useLegendStore } from "../../../../../store/useLegendStore";
import { useSelectedYearStore } from "../../../../../store/useYearFilter";
import { useDistrictStore } from "../../../../../store/useDistrictStore";
import { useUIStore } from "../../../../../store/useUIStore";
import { PropertyProps } from "../../../../../services/properties/propertiesApi";

const customStyles: StylesConfig<OptionType, false, GroupBase<OptionType>> = {
  control: (provided, state) => ({
    ...provided,
    boxShadow: "none",
    margin: "0px",
    width: "82px",
    height: "28px",
    minHeight: "10px",
    borderColor: "#fff",
    opacity: state.isDisabled ? 0.5 : 1,

    "&:hover": {
      borderColor: "#aaa",
    },
  }),
  menu: (provided) => ({
    ...provided,
    margin: "2px 0px",
  }),

  dropdownIndicator: (provided) => ({
    ...provided,
    padding: "0px 2px",
  }),

  indicatorSeparator: (provided) => ({
    ...provided,
    display: "none",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#78716c",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#78716c",
    fontWeight: "bold",
  }),
  option: (provided, state) => ({
    ...provided,
    display: "flex",
    alignItems: "center",
    backgroundColor: state.isFocused ? "#fafaf9" : "#fff",
    color: "#78716c",
  }),
};

interface OptionType {
  value: number | null;
  label: string;
}

export default function YearFilter() {
  const [loading, setLoading] = useState(true);
  const [years, setYears] = useState<number[]>([]);

  const options: OptionType[] = [
    { value: null, label: "Todos" },
    ...years
      .map((year) => ({
        value: year,
        label: year.toString(),
      }))
      .sort((a, b) => a.value! - b.value!),
  ];

  const areaFilter = useAreaFilter();

  const { listProperty } = useMapa();
  const { activeOption } = useUIStore();

  const { district } = useDistrictStore();

  const { selectedYear, updateSelectedYear } = useSelectedYearStore();

  const legend = useLegendStore();

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      const data = await listProperty();

      const entry = Object.entries(activityMap)
        .slice(1, -2)
        .find(([, value]) => value === activeOption.value);

      setYears(
        [
          ...new Set(
            data
              .filter((propriedade) =>
                entry
                  ? propriedade[entry[0] as keyof PropertyProps]
                  : propriedade
              )
              .filter((property) => {
                let filterByRadius;
                let filterByDistrict;

                const radiusFilter =
                  areaFilter.lat != 0 &&
                  areaFilter.lng != 0 &&
                  areaFilter.radius != 0;
                const districtFilter = district && district.geojson;

                let doFilter: boolean | undefined = true;

                if (radiusFilter) {
                  const centerPoint = L.latLng(areaFilter.lat, areaFilter.lng);
                  const currentPoint = L.latLng(property.lat, property.lng);

                  filterByRadius =
                    centerPoint.distanceTo(currentPoint) / 1000 <
                    areaFilter.radius;
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
              .map((property) => new Date(property.data).getFullYear())
          ),
        ].sort((a, b) => a - b)
      );
      setLoading(false);
    }
    fetchProperties();
  }, [listProperty, areaFilter, district, activeOption]);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
      data-tooltip-id="my-tooltip"
      data-tooltip-content="Filtrar por ano"
      data-tooltip-place="top"
    >
      <Select<OptionType>
        isSearchable={false}
        options={options}
        isDisabled={
          (!legend.propertyDensityVisible && !legend.propertyVisible) || loading
        }
        value={
          {
            value: selectedYear,
            label: selectedYear ? selectedYear.toString() : "Todos",
          } as OptionType
        }
        classNamePrefix="scrollable"
        styles={customStyles}
        menuPlacement="top"
        onChange={(option) => {
          updateSelectedYear(option?.value || undefined);
        }}
      />
    </div>
  );
}
