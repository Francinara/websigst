import styles from "./styles.module.scss";
import { Slider } from "@mui/material";
import { PropertyProps } from "../../../../../contexts/MapContext/types";
import { useFilterStore } from "../../../../../store/useFilterStore";
import { usePropertyStore } from "../../../../../store/usePropertyStore";

function valuetext(value: number) {
  return `${value}°C`;
}

const minDistance = 1;

export default function WaterDistance({
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

  const { propertySizeFilter, waterDistanceFilter, updateWaterDistanceFilter } =
    useFilterStore();

  const updateFilteredProperties = (filter: number[]) => {
    updatePropertyID(
      datas
        .filter(
          (item) =>
            item.water_distance / 1000 >= filter[0] &&
            item.water_distance / 1000 <= filter[1]
        )
        .filter(
          (property) =>
            property.area >= propertySizeFilter[0] &&
            property.area <= propertySizeFilter[1]
        )
        .map((item) => item.id)
    );
  };

  const handleChange = (
    _event: Event,
    newValue: number[] | number,
    activeThumb: number
  ) => {
    if (!Array.isArray(newValue)) return;

    if (selectedSlider !== "WaterDistance") {
      setSelectedSlider("WaterDistance");
    }

    const updatedFilter =
      activeThumb === 0
        ? [
            Math.min(newValue[0], waterDistanceFilter[1] - minDistance),
            waterDistanceFilter[1],
          ]
        : [
            waterDistanceFilter[0],
            Math.max(newValue[1], waterDistanceFilter[0] + minDistance),
          ];

    updateWaterDistanceFilter(updatedFilter);
    updateFilteredProperties(updatedFilter);
  };

  const handleInputChange = (index: number, value: string) => {
    const numericValue = parseInt(value, 10);
    if (isNaN(numericValue)) return;

    const updatedFilter = [...waterDistanceFilter];
    updatedFilter[index] = numericValue;

    if (index === 0) {
      updatedFilter[0] = Math.min(
        updatedFilter[0],
        waterDistanceFilter[1] - minDistance
      );
    } else {
      updatedFilter[1] = Math.max(
        updatedFilter[1],
        waterDistanceFilter[0] + minDistance
      );
    }

    updateWaterDistanceFilter(updatedFilter);
    updateFilteredProperties(updatedFilter);
  };

  return (
    <div className={styles.filterContainer}>
      <p>Distancia de corpos d’água, Km</p>
      <div className={styles.inputContainer}>
        <input
          className={styles.input}
          type="number"
          value={waterDistanceFilter[0]}
          min={min}
          max={waterDistanceFilter[1] - minDistance}
          onChange={(e) => handleInputChange(0, e.target.value)}
        />
        <div className={styles.slider}>
          <Slider
            getAriaLabel={() => "Water Distance Range"}
            value={waterDistanceFilter}
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
          value={waterDistanceFilter[1]}
          min={waterDistanceFilter[0] + minDistance}
          max={max}
          onChange={(e) => handleInputChange(1, e.target.value)}
        />
      </div>
    </div>
  );
}
