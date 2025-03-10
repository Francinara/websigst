import { CraftsmanshipProps } from "../../../../contexts/MapContext/types";
import styles from "../styles.module.scss";

export default function Craftsmanship({
  activities,
}: {
  activities: CraftsmanshipProps[];
}) {
  if (activities.length === 0) return null;
  return (
    <>
      <div className={styles.infoBoxContainer}>
        <h3 className={styles.titleInfoBox}>Artesanato</h3>
        {activities.map((craftsmanship) => (
          <div key={craftsmanship.id} className={styles.infoBox}>
            <div>
              <div className={styles.infoRow}>
                <div className={styles.flex1}>
                  <p className={styles.label}>Produto</p>
                  <p>{craftsmanship.produto}</p>
                </div>
                <div className={styles.flex1}>
                  <p className={styles.label}>Destinação do valor</p>
                  <p>{craftsmanship.destinacao_valor}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
