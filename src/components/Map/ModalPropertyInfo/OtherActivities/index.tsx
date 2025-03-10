import { OtherActivitiesProps } from "../../../../contexts/MapContext/types";
import styles from "../styles.module.scss";

export default function OtherActivities({
  activities,
}: {
  activities: OtherActivitiesProps[];
}) {
  if (activities.length === 0) return null;
  return (
    <>
      <div className={styles.infoBoxContainer}>
        <h3 className={styles.titleInfoBox}>Outras atividades</h3>
        {activities.map((otherActivity) => (
          <div key={otherActivity.id} className={styles.infoBox}>
            <div>
              <div className={styles.infoColumn}>
                <div className={styles.flex1}>
                  <p className={styles.label}>Tipo</p>
                  <p>{otherActivity.tipo}</p>
                </div>
                <div className={styles.flex1}>
                  <p className={styles.label}>Descrição</p>
                  <p>{otherActivity.descricao}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
