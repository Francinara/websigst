import styles from "./styles.module.scss";
import YearFilter from "./YearFilter";
import LayersControl from "./LayersControl";
import MapControls from "./MapControls";
import AreaFilter from "./AreaFilter";
import UserLocation from "./UserLocation";

export default function ToolBarContent() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.yearFilterContainer}>
          <YearFilter />
        </div>
        <LayersControl />
        <div className={styles.areaFilterandControlsContainer}>
          <AreaFilter />
          <MapControls />
          <UserLocation />
        </div>
      </div>
    </div>
  );
}
