import { useEffect, useState } from "react";
import { Navbar } from "../../components/Navbar";
import { useProperties } from "../../hooks/useProperties";
import { usePropertyStore } from "../../store/usePropertyStore";
import AgricultureChart from "../../components/Dashboard/AgricultureChart";
import AquacultureChart from "../../components/Dashboard/AquacultureChart";
import BeekeepingChart from "../../components/Dashboard/BeekeepingChart";
import CraftsmanshipChart from "../../components/Dashboard/CraftsmanshipChart";
import KPIs from "../../components/Dashboard/KPIs";
import LivestockChart from "../../components/Dashboard/LivestockChart";
import Map from "../../components/Dashboard/Map";
import VisitsChart from "../../components/Dashboard/VisitsChart";
import WaterResourcesChart from "../../components/Dashboard/WaterResourcesChart";
import { useVisits } from "../../hooks/useVisits";
import BeneficiariesChart from "../../components/Dashboard/BeneficiariesChart";

import Select from "react-select";
import {
  DistrictOption,
  useDashboardStore,
} from "../../store/useDashboardStore";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { data: properties } = useProperties();
  const { updatePropertyID } = usePropertyStore();
  const { data: visits } = useVisits();
  const { district, updateDistrict, yearsInterval, updateYearsInterval } =
    useDashboardStore();

  const [ignoreEffect, setIgnoreEffect] = useState(false);

  const [activityTypes, setActivityTypes] = useState(
    Array.from(new Set(properties?.map(({ distrito }) => distrito)))
  );

  const availableYears = Array.from(
    new Set(properties?.map((prop) => new Date(prop.data).getFullYear()))
  ).sort((a, b) => a - b);

  useEffect(() => {
    if (!yearsInterval.length && availableYears.length) {
      updateYearsInterval([
        availableYears[0],
        availableYears[availableYears.length - 1],
      ]);
    }
  }, [availableYears, yearsInterval, updateYearsInterval]);

  const options = activityTypes
    .map((type) => ({
      value: type,
      label: type,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

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
    updatePropertyID(
      Array.from(
        new Set(
          properties
            ?.filter((property) => {
              const propertyYear = new Date(property.data).getFullYear();
              const [startYear, endYear] = yearsInterval;
              const yearMatch =
                propertyYear >= startYear && propertyYear <= endYear;

              return district.length > 0
                ? district.some((d) => property.distrito === d.value) &&
                    yearMatch
                : yearMatch;
            })
            .map((property) => property.id)
        )
      )
    );
  }, [properties, updatePropertyID, district, yearsInterval]);

  const selectedFirstYearChange: (year: number) => void = (year) => {
    const [_, currentLastYear] = yearsInterval;
    if (year >= currentLastYear) {
      const nextYear = year + 1;
      if (availableYears?.includes(nextYear)) {
        updateYearsInterval([year, nextYear]);
      } else {
        updateYearsInterval([year - 1, year]);
      }
    } else {
      updateYearsInterval([year, currentLastYear]);
    }
  };

  const selectedLastYearChange: (year: number) => void = (year) => {
    const [currentFirstYear] = yearsInterval;
    if (year <= currentFirstYear) {
      const previousYear = year - 1;
      if (availableYears?.includes(previousYear)) {
        updateYearsInterval([previousYear, year]);
      } else {
        updateYearsInterval([year, year + 1]);
      }
    } else {
      updateYearsInterval([currentFirstYear, year]);
    }
  };

  const yearOptions = availableYears.map((year) => ({
    value: year,
    label: year.toString(),
  }));

  return (
    <div className="flex flex-col h-screen w-full">
      <Navbar />
      <div className="px-6 pb-6 pt-3 mt-[100px] overflow-y-auto">
        <div className="flex flex-wrap gap-3 justify-between pb-4">
          <div>
            <h1 className="text-2xl font-medium text-left text-gray-600">
              Dashboard de Gestão Rural e Recursos Hídricos
            </h1>
          </div>
          <div className="flex gap-2 z-[1001]">
            <Select
              value={district}
              isMulti
              name="districts"
              options={options}
              className={`basic-multi-select min-w-52`}
              classNamePrefix="scrollable"
              onChange={(option) => {
                setIgnoreEffect(true);
                updateDistrict(option as DistrictOption[]);
              }}
              placeholder="Selecione um distrito..."
            />
            <div className="flex gap-2">
              <Select
                value={yearOptions.find(
                  (opt) => opt.value === yearsInterval[0]
                )}
                onChange={(selectedOption) => {
                  if (selectedOption)
                    selectedFirstYearChange(selectedOption.value);
                }}
                options={yearOptions}
                className="min-w-24"
                placeholder="Selecione..."
              />
              <Select
                value={yearOptions.find(
                  (opt) => opt.value === yearsInterval[1]
                )}
                onChange={(selectedOption) => {
                  if (selectedOption)
                    selectedLastYearChange(selectedOption.value);
                }}
                options={yearOptions}
                className="min-w-24"
                placeholder="Selecione..."
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            <KPIs properties={properties} visits={visits} />
            <div>
              <div className="h-[230px] bg-white rounded-t-lg  shadow-md overflow-hidden">
                <Map />
              </div>
              <div className="bg-white border rounded-b-lg py-2 px-3  text-green-700 text-right">
                <Link to="/">Ver Mapa</Link>
              </div>
            </div>
            <VisitsChart />
            <BeneficiariesChart />
          </div>

          <div className="space-y-3 flex flex-col">
            <AgricultureChart />
            <LivestockChart />
            <AquacultureChart />
          </div>

          <div className="space-y-3 flex flex-col">
            <BeekeepingChart />
            <CraftsmanshipChart />
            <WaterResourcesChart />
          </div>
        </div>
      </div>
    </div>
  );
}
