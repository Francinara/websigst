import Map from "../../components/Map";
import { Navbar } from "../../components/Navbar";

import styles from "./styles.module.scss";

export function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.content}>
          <Navbar />
          <div className={styles.mapContainer}>
            <Map />
          </div>
        </div>
      </main>
    </div>
  );
}
