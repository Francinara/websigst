import styles from "./styles.module.scss";
import { Slider } from "@mui/material";
import { PropertyProps } from "../../../../../contexts/MapContext/types";
import { useFilterStore } from "../../../../../store/useFilterStore";
import { usePropertyStore } from "../../../../../store/usePropertyStore";

function valuetext(value: number) {
  return `${value}°C`;
}

const minDistance = 1;

export default function PropertySize({
  datas,
  min,
  max,
  selectedSlider,
  setSelectedSlider,
}: {
  datas: PropertyProps[];
  min: number | undefined;
  max: number | undefined;
  selectedSlider: string;
  setSelectedSlider: (chartName: string) => void;
}) {
  const { updatePropertyID } = usePropertyStore();

  const { propertySizeFilter, waterDistanceFilter, updatePropertySizeFilter } =
    useFilterStore();

  const updateFilteredProperties = (filter: number[]) => {
    updatePropertyID(
      datas
        .filter((item) => item.area >= filter[0] && item.area <= filter[1])
        .filter(
          (property) =>
            property.water_distance / 1000 >= waterDistanceFilter[0] &&
            property.water_distance / 1000 <= waterDistanceFilter[1]
        )
        .map((item) => item.id)
    );
  };

  const handleChange = (
    _event: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    if (!Array.isArray(newValue)) return;

    if (selectedSlider !== "PropertySize") {
      setSelectedSlider("PropertySize");
    }

    const updatedFilter =
      activeThumb === 0
        ? [
            Math.min(newValue[0], propertySizeFilter[1] - minDistance),
            propertySizeFilter[1],
          ]
        : [
            propertySizeFilter[0],
            Math.max(newValue[1], propertySizeFilter[0] + minDistance),
          ];

    updatePropertySizeFilter(updatedFilter);
    updateFilteredProperties(updatedFilter);
  };

  const handleInputChange = (index: number, value: string) => {
    const numericValue = parseInt(value, 10);
    if (isNaN(numericValue)) return;

    const updatedFilter = [...propertySizeFilter];
    updatedFilter[index] = numericValue;

    if (index === 0) {
      updatedFilter[0] = Math.min(
        updatedFilter[0],
        propertySizeFilter[1] - minDistance
      );
    } else {
      updatedFilter[1] = Math.max(
        updatedFilter[1],
        propertySizeFilter[0] + minDistance
      );
    }

    updatePropertySizeFilter(updatedFilter);
    updateFilteredProperties(updatedFilter);
  };

  return (
    <div className={styles.filterContainer}>
      <p>Tamanho das propriedades, Km²</p>
      <div className={styles.inputContainer}>
        <input
          className={styles.input}
          type="number"
          value={propertySizeFilter[0]}
          min={min}
          max={propertySizeFilter[1] - minDistance}
          onChange={(e) => handleInputChange(0, e.target.value)}
        />
        <div className={styles.slider}>
          <Slider
            getAriaLabel={() => "Property Size Range"}
            value={propertySizeFilter}
            onChange={handleChange}
            valueLabelDisplay="auto"
            getAriaValueText={valuetext}
            color="success"
            min={min}
            max={max}
            sx={{
              "& .MuiSlider-thumb": {
                width: 12,
                height: 12,
              },
            }}
            disableSwap
          />
        </div>

        <input
          className={styles.input}
          type="number"
          value={propertySizeFilter[1]}
          min={propertySizeFilter[0] + minDistance}
          max={max}
          onChange={(e) => handleInputChange(1, e.target.value)}
        />
      </div>
    </div>
  );
}
