import styles from "./styles.module.scss";
import FiltersContent from "./FiltersContent";
import { useEffect } from "react";
import ChartsContent from "./ChartsContent";
import { activityOptions } from "../../MapMenu/MenuContent";
import { useUIStore } from "../../../../store/useUIStore";

export default function ChartsContainerContent() {
  const {
    isFilterVisible,
    isChartsVisible,
    isSidebarVisible,
    updateIsSidebarVisible,
    activeOption,
    updateActiveOption,
  } = useUIStore();

  useEffect(() => {
    updateIsSidebarVisible(!isChartsVisible && !isFilterVisible ? false : true);
  }, [isChartsVisible, isFilterVisible, updateIsSidebarVisible]);

  if (!isSidebarVisible) return null;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
      className={`${styles.sidebar}`}
    >
      <div className={`${styles.nav} scrollable-content`}>
        <div className={styles.buttonGroup}>
          {activityOptions.map((item) => (
            <button
              key={item.value}
              onClick={() => updateActiveOption(item)}
              className={`${styles.button} ${
                activeOption.label === item.label
                  ? styles.active
                  : styles.inactive
              }`}
            >
              {item.icon}
              {activeOption.label === item.label && (
                <span className={styles.buttonLabel}>{item.value}</span>
              )}
            </button>
          ))}
        </div>
        <div className={styles.activeOption}>{activeOption.value}</div>
      </div>
      <ChartsContent />
      <FiltersContent />
    </div>
  );
}
