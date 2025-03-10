import { useState, useEffect } from "react";
import styles from "./style.module.scss";
import {
  legendItems,
  roadItems,
  LegendKeys,
} from "../../../../utils/constants";
import {
  CaretDoubleLeft,
  CaretDoubleRight,
  CaretDown,
  CaretUp,
} from "@phosphor-icons/react";
import { Tooltip } from "@mui/material";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import { useLegendStore } from "../../../../store/useLegendStore";
import { useDistrictStore } from "../../../../store/useDistrictStore";

type CheckedItems = {
  [key in LegendKeys]: boolean;
};

export default function LegendContent() {
  const [checkedItems, setCheckedItems] = useState<CheckedItems>(
    [...legendItems, ...roadItems].reduce((acc, item) => {
      acc[item.key] = false;
      return acc;
    }, {} as CheckedItems)
  );
  const [roadsExpanded, setRoadsExpanded] = useState(true);
  const [selectedRadio, setSelectedRadio] = useState("");
  const [isLegendVisible, setIsLegendVisible] = useState(true);
  const [roadsIndeterminate, setRoadsIndeterminate] = useState(false);

  const { resetDistrict } = useDistrictStore();

  const {
    updateLegend,
    urbanizedAreasVisible,
    communitysVisible,
    districtsVisible,
    watersVisible,
    drainagesVisible,
    springsVisible,
    subBasinVisible,
    roadBR232Visible,
    roadPE320Visible,
    roadPE365Visible,
    roadPE390Visible,
    roadPE418Visible,
    roadPavedVisible,
    roadUnpavedVisible,
    propertyDensityVisible,
    propertyVisible,
  } = useLegendStore();

  useEffect(() => {
    const allChecked = roadItems.every((item) => checkedItems[item.key]);
    const noneChecked = roadItems.every((item) => !checkedItems[item.key]);

    setRoadsIndeterminate(!allChecked && !noneChecked);
  }, [checkedItems]);

  useEffect(() => {
    const initialCheckedItems: CheckedItems = [
      ...legendItems,
      ...roadItems,
    ].reduce((acc, item) => {
      switch (item.key) {
        case "urbanizedAreasVisible":
          acc[item.key] = urbanizedAreasVisible;
          break;
        case "communitysVisible":
          acc[item.key] = communitysVisible;
          break;
        case "districtsVisible":
          acc[item.key] = districtsVisible;
          break;
        case "watersVisible":
          acc[item.key] = watersVisible;
          break;
        case "drainagesVisible":
          acc[item.key] = drainagesVisible;
          break;
        case "springsVisible":
          acc[item.key] = springsVisible;
          break;
        case "subBasinVisible":
          acc[item.key] = subBasinVisible;
          break;
        case "roadBR232Visible":
          acc[item.key] = roadBR232Visible;
          break;
        case "roadPE320Visible":
          acc[item.key] = roadPE320Visible;
          break;
        case "roadPE365Visible":
          acc[item.key] = roadPE365Visible;
          break;
        case "roadPE390Visible":
          acc[item.key] = roadPE390Visible;
          break;
        case "roadPE418Visible":
          acc[item.key] = roadPE418Visible;
          break;
        case "roadPavedVisible":
          acc[item.key] = roadPavedVisible;
          break;
        case "roadUnpavedVisible":
          acc[item.key] = roadUnpavedVisible;
          break;
        default:
          acc[item.key] = false;
      }
      return acc;
    }, {} as CheckedItems);

    setCheckedItems(initialCheckedItems);
  }, [
    urbanizedAreasVisible,
    communitysVisible,
    districtsVisible,
    watersVisible,
    drainagesVisible,
    springsVisible,
    subBasinVisible,
    roadBR232Visible,
    roadPE320Visible,
    roadPE365Visible,
    roadPE390Visible,
    roadPE418Visible,
    roadPavedVisible,
    roadUnpavedVisible,
    propertyDensityVisible,
    propertyVisible,
  ]);

  useEffect(() => {
    if (propertyDensityVisible) {
      setSelectedRadio("property_density");
    } else if (propertyVisible) {
      setSelectedRadio("property");
    } else {
      setSelectedRadio("hide_property");
    }
  }, []);

  const handleCheckboxChange =
    (key: LegendKeys) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = event.target.checked;
      const newCheckedItems = {
        ...checkedItems,
        [key]: isChecked,
      };
      setCheckedItems(newCheckedItems);
      updateLegend(key, isChecked);
    };

  const handleRoadsCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const isChecked = event.target.checked;
    const newCheckedItems = { ...checkedItems };
    roadItems.forEach((item) => {
      newCheckedItems[item.key] = isChecked;
      updateLegend(item.key, isChecked);
    });
    setCheckedItems(newCheckedItems);
  };

  useEffect(() => {
    const allChecked = roadItems.every((item) => checkedItems[item.key]);
    const noneChecked = roadItems.every((item) => !checkedItems[item.key]);
    const roadCheckbox = document.getElementById(
      "roads-checkbox"
    ) as HTMLInputElement;

    if (roadCheckbox) {
      roadCheckbox.checked = allChecked;
      roadCheckbox.indeterminate = !allChecked && !noneChecked;
    }
  }, [checkedItems]);

  useEffect(() => {
    if (!districtsVisible) {
      resetDistrict();
    }
  }, [districtsVisible, resetDistrict]);

  useEffect(() => {
    if (selectedRadio === "property_density") {
      updateLegend(LegendKeys.propertyDensityVisible, true);
      updateLegend(LegendKeys.propertyVisible, false);
    } else if (selectedRadio === "property") {
      updateLegend(LegendKeys.propertyDensityVisible, false);
      updateLegend(LegendKeys.propertyVisible, true);
    } else {
      updateLegend(LegendKeys.propertyDensityVisible, false);
      updateLegend(LegendKeys.propertyVisible, false);
    }
  }, [selectedRadio, updateLegend]);

  function toggleLegend(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    setIsLegendVisible(!isLegendVisible);
  }

  useEffect(() => {
    console.log(window.innerWidth);

    if (window.innerWidth <= 960) {
      setIsLegendVisible(false);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsLegendVisible(window.innerWidth > 960);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isLegendVisible &&
        window.innerWidth <= 960 &&
        !document
          .querySelector(".custom-legend")
          ?.contains(event.target as Node)
      ) {
        setIsLegendVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("mouseup", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("mouseup", handleClickOutside);
    };
  }, [isLegendVisible]);

  return (
    <>
      {isLegendVisible ? (
        <div className={styles.container}>
          <Tooltip title="Ocultar Legenda" disableInteractive>
            <button
              className={styles.collapseButtonClose}
              onClick={toggleLegend}
            >
              <CaretDoubleRight size={14} />
            </button>
          </Tooltip>
          <h4 className={styles.header}>Legenda</h4>
          <div className={`${styles.checkboxContainer} scrollable-content`}>
            <FormGroup>
              {legendItems.map((item) => (
                <div key={item.label} className={styles.item}>
                  {item.icon === "line" && (
                    <div
                      className={styles.lineIcon}
                      style={{
                        background: checkedItems[item.key]
                          ? item.color
                          : "transparent",
                        border: checkedItems[item.key]
                          ? "none"
                          : "1px solid #ccc",
                      }}
                    ></div>
                  )}
                  {item.icon === "text" && (
                    <div
                      className={styles.textIcon}
                      style={{
                        color: checkedItems[item.key]
                          ? item.color
                          : "transparent",
                        WebkitTextStroke: checkedItems[item.key]
                          ? "0px"
                          : "0.5px #ccc",
                      }}
                    >
                      abc
                    </div>
                  )}

                  {item.icon === "circle" && (
                    <div
                      className={styles.circleIcon}
                      style={{
                        background: checkedItems[item.key]
                          ? item.color
                          : "transparent",
                        border: checkedItems[item.key]
                          ? "none"
                          : "1px solid #ccc",
                      }}
                    ></div>
                  )}
                  <div className={styles.checkboxContent}>
                    <FormControlLabel
                      label={item.label}
                      sx={labelStyle}
                      control={
                        <div className={styles.itemCheckbox}>
                          <Checkbox
                            sx={radioStyle}
                            checked={checkedItems[item.key]}
                            onChange={handleCheckboxChange(item.key)}
                          />
                        </div>
                      }
                    />
                  </div>
                </div>
              ))}
            </FormGroup>
            <div className={styles.item}>
              <div className={styles.checkboxContentIndeterminate}>
                <FormControlLabel
                  label="Estradas"
                  sx={labelStyle}
                  control={
                    <div className={styles.itemCheckboxIndeterminate}>
                      <Checkbox
                        id="roads-checkbox"
                        checked={roadItems.every(
                          (item) => checkedItems[item.key]
                        )}
                        indeterminate={roadsIndeterminate}
                        onChange={handleRoadsCheckboxChange}
                        sx={checkboxIndeterminateStyle}
                      />
                    </div>
                  }
                />
              </div>
              <button
                className={styles.expandButton}
                onClick={(event) => {
                  event.stopPropagation;
                  setRoadsExpanded(!roadsExpanded);
                }}
              >
                {roadsExpanded ? <CaretDown /> : <CaretUp />}
              </button>
            </div>
            <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
              <div className={styles.roads}>
                {roadsExpanded &&
                  roadItems.map((item) => (
                    <div key={item.label} className={`${styles.item}`}>
                      <i
                        className={styles.lineIcon}
                        style={{
                          background: checkedItems[item.key]
                            ? item.color
                            : "transparent",
                          border: checkedItems[item.key]
                            ? "none"
                            : "1px solid #ccc",
                        }}
                      ></i>
                      <div className={styles.checkboxContent}>
                        <FormControlLabel
                          label={item.label}
                          sx={labelStyle}
                          control={
                            <div className={styles.itemCheckbox}>
                              <Checkbox
                                sx={radioStyle}
                                checked={checkedItems[item.key]}
                                onChange={handleCheckboxChange(item.key)}
                              />
                            </div>
                          }
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </Box>
          </div>
          <div className={styles.radioButtonContainer}>
            <RadioGroup
              aria-labelledby="radio-options-label"
              name="propertyOptions"
              value={selectedRadio}
              onChange={(e) => setSelectedRadio(e.target.value)}
            >
              <div className={styles.radioButtonContent}>
                <FormControlLabel
                  value="property_density"
                  control={<Radio sx={radioStyle} />}
                  label="Distribuição de Propriedades"
                  sx={labelStyle}
                />
              </div>
              <div className={styles.radioButtonContent}>
                <FormControlLabel
                  value="property"
                  control={<Radio sx={radioStyle} />}
                  label="Exibir Propriedades"
                  sx={labelStyle}
                />
              </div>
              <div className={styles.radioButtonContent}>
                <FormControlLabel
                  value="hide_property"
                  control={<Radio sx={radioStyle} />}
                  label="Ocultar Propriedades"
                  sx={labelStyle}
                />
              </div>
            </RadioGroup>
          </div>
        </div>
      ) : (
        <Tooltip title="Exibir Legenda" disableInteractive>
          <button className={styles.collapseButtonOpen} onClick={toggleLegend}>
            <CaretDoubleLeft size={14} />
          </button>
        </Tooltip>
      )}
    </>
  );
}

const radioStyle = {
  color: "#ccc",
  "&.Mui-checked": { color: "#006400" },
  "& .MuiSvgIcon-root": { fontSize: 16 },
};

const labelStyle = {
  "& .MuiFormControlLabel-label": {
    fontSize: 12,
  },
};

const checkboxIndeterminateStyle = {
  "&.MuiCheckbox-indeterminate": { color: "#006400" },
  color: "#ccc",
  "&.Mui-checked": { color: "#006400" },
  "& .MuiSvgIcon-root": { fontSize: 16 },
};
