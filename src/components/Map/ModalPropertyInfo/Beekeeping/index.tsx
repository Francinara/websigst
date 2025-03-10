import { BeekeepingProps } from "../../../../contexts/MapContext/types";
import styles from "../styles.module.scss";

export default function Beekeeping({
  activities,
}: {
  activities: BeekeepingProps[];
}) {
  if (activities.length === 0) return null;
  return (
    <>
      <div className={styles.infoBoxContainer}>
        <h3 className={styles.titleInfoBox}>Apicultura</h3>

        {activities.map((beekeeping) => (
          <div key={beekeeping.id} className={styles.infoBox}>
            <div className={styles.infoRow}>
              <div className={styles.flex1}>
                <p className={styles.label}>Tipo</p>
                <p>{beekeeping.sem_ferrao ? "Sem ferrão" : null}</p>
                <p>{beekeeping.com_ferrao ? "Com ferrão" : null}</p>
              </div>
              <div className={styles.flex1}>
                <p className={styles.label}>Nº de colmeias</p>
                <p>{beekeeping.n_colmeias}</p>
              </div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.flex1}>
                <p className={styles.label}>Tipo de criação</p>
                {beekeeping.tipo_criacao && <p>Criação</p>}
                {beekeeping.tipo_extrativismo && <p>Extrativismo</p>}
              </div>
              <div className={styles.flex1}>
                <p className={styles.label}>Destinação do mel</p>
                <p>{beekeeping.destinacao_mel}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
