import { useEffect, useState, useMemo } from "react";
import ButtonGroup from "../TemporalData/ButtonGroup";
import FilterSelect from "../TemporalData/FilterSelect";
import StatisticPanel from "../TemporalData/StatisticPanel";
import StatisticsSummary from "../TemporalData/StatisticsSummary";
import {
  OptionsUnits,
  ProductiveActivities,
  ProductiveActivitiesKeys,
  VisibilityOptions,
  VisibilityOptionsType,
} from "../../utils/types";
import ChartSVG from "./ChartSVG";

import styles from "./styles.module.scss";

type IntervalsType = Record<number, Record<string, number>>;

type AllowedCategoryTypes = "especie" | "cultura" | "tipo" | "produto";

const isValidCategory = (
  item: ProductiveActivities,
  key: ProductiveActivitiesKeys
): key is keyof ProductiveActivities => {
  return key in item;
};

type ProcessDataType = {
  processedData: Array<{ year: number; [category: string]: number }>;
  categories: string[];
};

const processData = (
  data: ProductiveActivities[],
  selectedCategory: string,
  selectedDistrict: string,
  startYear: number,
  endYear: number,
  aggregateData: (
    item: ProductiveActivities,
    option: VisibilityOptions
  ) => number,
  categoryType: AllowedCategoryTypes,
  option: VisibilityOptions
): ProcessDataType => {
  const filteredData =
    selectedCategory === "all"
      ? selectedDistrict === "all"
        ? data
        : data.filter((item) => item.distrito === selectedDistrict)
      : selectedDistrict === "all"
      ? data.filter(
          (item) =>
            isValidCategory(item, categoryType) &&
            item[categoryType] === selectedCategory
        )
      : data
          .filter(
            (item) =>
              isValidCategory(item, categoryType) &&
              item[categoryType] === selectedCategory
          )
          .filter((item) => item.distrito === selectedDistrict);

  const intervals: IntervalsType = filteredData.reduce((acc, item) => {
    const year = new Date(item.data).getFullYear();

    const category = isValidCategory(item, categoryType)
      ? (item[categoryType] as string)
      : "";
    const value = aggregateData(item, option);
    acc[year] = acc[year] || {};
    acc[year][category] = (acc[year][category] || 0) + value;
    return acc;
  }, {} as IntervalsType);

  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  );

  const categories = Array.from(
    new Set(
      data.map((item) =>
        isValidCategory(item, categoryType)
          ? (item[categoryType] as string)
          : ""
      )
    )
  ).sort();

  return {
    processedData: years.map((year) => ({
      year,
      ...categories.reduce(
        (acc, category) => ({
          ...acc,
          [category]: intervals[year]?.[category] || 0,
        }),
        {}
      ),
    })),
    categories,
  };
};

type TemporalDataType = {
  data: ProductiveActivities[];
  categoryType: AllowedCategoryTypes;
  type: string;
  aggregateData: (
    item: ProductiveActivities,
    option: VisibilityOptions
  ) => number;
  visibilityOptions: VisibilityOptionsType;
  optionsUnits: OptionsUnits;
  optionsTitles: OptionsUnits;
};

export default function TemporalData({
  data,
  categoryType,
  type,
  aggregateData,
  visibilityOptions,
  optionsUnits,
  optionsTitles,
}: TemporalDataType) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("all");

  const [selectedFirstYear, setSelectedFirstYear] = useState<number>(0);
  const [selectedLastYear, setSelectedLastYear] = useState<number>(0);
  const [allYears, setAllYears] = useState<number[]>();
  const [allDistricts, setAllDistricts] = useState<string[]>();
  const [selectedButton, setSelectedButton] = useState(
    visibilityOptions.Property
  );
  const options = Object.values(visibilityOptions);
  const [selectedIntervals, setSelectedIntervals] = useState<string[]>([]);

  function selectedCategoryChange(culture: string) {
    setSelectedIntervals([]);
    setSelectedCategory(culture);
    setSelectedDistrict("all");
  }

  function selectedDistrictChange(culture: string) {
    setSelectedIntervals([]);
    setSelectedDistrict(culture);
  }

  function updateYears(newFirstYear: number, newLastYear: number) {
    setSelectedFirstYear(newFirstYear);
    setSelectedLastYear(newLastYear);
  }

  function selectedFirstYearChange(year: number) {
    if (year >= selectedLastYear) {
      const nextYear = year + 1;
      if (allYears?.includes(nextYear)) {
        updateYears(year, nextYear);
      } else {
        updateYears(year - 1, year);
      }
    } else {
      setSelectedFirstYear(year);
    }
  }

  function selectedLastYearChange(year: number) {
    if (year <= selectedFirstYear) {
      const previousYear = year - 1;
      if (allYears?.includes(previousYear)) {
        updateYears(previousYear, year);
      } else {
        updateYears(year, year + 1);
      }
    } else {
      setSelectedLastYear(year);
    }
  }

  useEffect(() => {
    let years;
    if (selectedCategory === "all") {
      years =
        selectedDistrict === "all"
          ? [...new Set(data.map((item) => new Date(item.data).getFullYear()))]
          : [
              ...new Set(
                data
                  .filter((item) => selectedDistrict === item.distrito)
                  .map((item) => new Date(item.data).getFullYear())
              ),
            ];
    } else {
      years =
        selectedDistrict === "all"
          ? [
              ...new Set(
                data
                  .filter(
                    (item) =>
                      (isValidCategory(item, categoryType)
                        ? (item[categoryType] as string)
                        : "") === selectedCategory
                  )
                  .map((item) => new Date(item.data).getFullYear())
              ),
            ]
          : [
              ...new Set(
                data
                  .filter(
                    (item) =>
                      (isValidCategory(item, categoryType)
                        ? (item[categoryType] as string)
                        : "") === selectedCategory
                  )
                  .filter((item) => selectedDistrict === item.distrito)
                  .map((item) => new Date(item.data).getFullYear())
              ),
            ];
    }

    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);

    setAllYears(
      Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i)
    );

    setSelectedFirstYear(minYear);
    setSelectedLastYear(maxYear);
  }, [data, selectedCategory, categoryType, selectedDistrict]);

  useEffect(() => {
    let districts;
    if (selectedCategory === "all") {
      districts = [...new Set(data.map((item) => item.distrito))];
    } else {
      districts = [
        ...new Set(
          data
            .filter(
              (item) =>
                (isValidCategory(item, categoryType) &&
                  (item[categoryType] as string)) === selectedCategory
            )
            .map((item) => item.distrito)
        ),
      ];
    }

    setAllDistricts(districts);
  }, [data, selectedCategory, categoryType]);

  const { processedData, categories } = useMemo(
    () =>
      processData(
        data,
        selectedCategory,
        selectedDistrict,
        selectedFirstYear,
        selectedLastYear,
        aggregateData,
        categoryType,
        selectedButton
      ),
    [
      data,
      selectedCategory,
      selectedDistrict,
      selectedButton,
      selectedFirstYear,
      selectedLastYear,
      aggregateData,
      categoryType,
    ]
  );

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartContainerFilter}>
        <ButtonGroup
          options={options}
          selectedButton={selectedButton}
          setSelectedButton={setSelectedButton}
          setSelectedIntervals={setSelectedIntervals}
        />
        <FilterSelect
          type={type}
          category={{
            selected: selectedCategory,
            onChange: selectedCategoryChange,
            options: categories,
          }}
          district={{
            selected: selectedDistrict,
            onChange: selectedDistrictChange,
            options: allDistricts,
          }}
          year={{
            selectedFirst: selectedFirstYear,
            onChangeFirst: selectedFirstYearChange,
            selectedLast: selectedLastYear,
            onChangeLast: selectedLastYearChange,
            options: allYears,
          }}
        />
      </div>
      <StatisticPanel
        selectedCategory={selectedCategory}
        processedData={processedData}
        selectedButton={selectedButton}
        optionsUnits={optionsUnits}
      />
      <div className={styles.chartSVGContainer}>
        <ChartSVG
          categories={categories}
          selectedCategory={selectedCategory}
          selectedIntervals={selectedIntervals}
          setSelectedIntervals={setSelectedIntervals}
          selectedButton={selectedButton}
          optionsUnits={optionsUnits}
          processedData={processedData}
          optionsTitles={optionsTitles}
        />
        <StatisticsSummary
          selectedCategory={selectedCategory}
          processedData={processedData}
          selectedButton={selectedButton}
          optionsUnits={optionsUnits}
        />
      </div>
    </div>
  );
}
