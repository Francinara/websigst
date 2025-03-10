import { AgricultureProps } from "../../../../contexts/MapContext/types";
import styles from "../styles.module.scss";

export default function Agriculture({
  activities,
}: {
  activities: AgricultureProps[];
}) {
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

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
        <h3 className={styles.titleInfoBox}>Agricultura</h3>
        {activities.map((agriculture) => (
          <div key={agriculture.id} className={styles.infoBox}>
            <div className={styles.infoRow}>
              <div className={styles.flex1}>
                <p className={styles.label}>Cultura</p>
                <p>{agriculture.cultura}</p>
              </div>
              <div className={styles.flex1}>
                <p className={styles.label}>Irrigação</p>
                {agriculture.irrigacao ? <p>Sim</p> : <p>Não</p>}
              </div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.flex1}>
                <p className={styles.label}>Produção ao ano</p>
                <p>{agriculture.producao_ano}</p>
              </div>
              <div className={styles.flex1}>
                <p className={styles.label}>Área de cultivo</p>
                <p>{agriculture.area_cultivo}</p>
              </div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.flex1}>
                <p className={styles.label}>Data de plantio</p>
                <p>{formatDate(agriculture.data_plantio)}</p>
              </div>
              <div className={styles.flex1}>
                <p className={styles.label}>Data de colheita</p>
                <p>{formatDate(agriculture.data_colheita)}</p>{" "}
              </div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.flex1}>
                <p className={styles.label}>Destinação venda</p>
                <p>{agriculture.destinacao_venda}</p>
              </div>
              <div className={styles.flex1}>
                <p className={styles.label}>Valor</p>
                <p>{formatarDinheiro(agriculture.valor_comercializado)}</p>
              </div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.flex1}>
                <p className={styles.label}>Destinação casa</p>
                <p>{agriculture.destinacao_casa}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
