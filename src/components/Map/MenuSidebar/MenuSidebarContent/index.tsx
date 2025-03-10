import {
  ChartBarHorizontal,
  FadersHorizontal,
  Table,
} from "@phosphor-icons/react";
import styles from "./styles.module.scss";
import { useUploadStore } from "../../../../store/useUploadStore";
import { useUIStore } from "../../../../store/useUIStore";

export default function MenuSidebarContent() {
  const {
    isTableVisible,
    updateIsTableVisible,
    isFilterVisible,
    updateIsFilterVisible,
    isChartsVisible,
    updateIsChartsVisible,
  } = useUIStore();
  const { upload } = useUploadStore();

  return (
    <div className={styles.sidebar}>
      <button
        className={`${isChartsVisible ? styles.isActive : styles.button}`}
        onClick={() => updateIsChartsVisible(!isChartsVisible)}
      >
        <ChartBarHorizontal size={24} />
      </button>
      <button
        className={`${isFilterVisible ? styles.isActive : styles.button}`}
        onClick={() => updateIsFilterVisible(!isFilterVisible)}
      >
        <FadersHorizontal size={24} />
      </button>
      {upload.length >= 1 && <div className={styles.border}></div>}
      {upload.length >= 1 && (
        <button
          className={`${isTableVisible ? styles.isActive : styles.button}`}
          onClick={() => updateIsTableVisible(!isTableVisible)}
        >
          <Table size={24} />
        </button>
      )}
    </div>
  );
}
