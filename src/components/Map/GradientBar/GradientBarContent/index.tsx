import styles from "./styles.module.scss";

export default function GradientBarContent() {
  return (
    <div className={styles.container}>
      <div className={styles.legendLabel}>
        <span>Alta</span>
        <span>Baixa</span>
      </div>
      <div className={styles.gradientBar}></div>
    </div>
  );
}
