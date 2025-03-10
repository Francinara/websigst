import { LivestockProps } from "../../../../contexts/MapContext/types";
import styles from "../styles.module.scss";

export default function Livestock({
  activities,
}: {
  activities: LivestockProps[];
}) {
  function formatarDinheiro(valor: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(valor);
  }

  if (activities.length === 0) return null;

  return (
    <>
      <div className={styles.infoBoxContainer}>
        <h3 className={styles.titleInfoBox}>Pecuária</h3>
        {activities.map((livestock) => (
          <div key={livestock.id} className={styles.infoBox}>
            <div className={styles.infoRow}>
              <div className={styles.flex1}>
                <p className={styles.label}>Especie</p>
                <p>{livestock.especie}</p>
              </div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.flex1}>
                <p className={styles.label}>Raça predominante</p>
                <p>{livestock.raca_predominante}</p>
              </div>
              <div className={styles.flex1}>
                <p className={styles.label}>Quantidade</p>
                <p>{livestock.quantidade}</p>
              </div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.flex1}>
                <p className={styles.label}>Aptidão</p>
                {livestock.aptidao_corte && <p>Corte</p>}
                {livestock.aptidao_leite && <p>Leite</p>}
                {livestock.aptidao_postura && <p>Postura</p>}
              </div>
              <div className={styles.flex1}>
                <p className={styles.label}>Tipo de criação</p>
                {livestock.tipo_cricao_intensivo && <p>Intensivo</p>}
                {livestock.tipo_cricao_semi_intensivo && <p>Semi Intensivo</p>}
                {livestock.tipo_cricao_extensivo && <p>Extensivo</p>}
              </div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.flex1}>
                <p className={styles.label}>Destinação venda</p>
                <p>{livestock.destinacao_venda}</p>
              </div>
              <div className={styles.flex1}>
                <p className={styles.label}>Valor</p>
                <p>{formatarDinheiro(livestock.valor_comercializacao)}</p>
              </div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.flex1}>
                <p className={styles.label}>Destinação casa</p>
                <p>{livestock.destinacao_casa}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
