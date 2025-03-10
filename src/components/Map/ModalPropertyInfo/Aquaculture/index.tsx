import { AquacultureProps } from "../../../../contexts/MapContext/types";
import styles from "../styles.module.scss";

export default function Aquaculture({
  activities,
}: {
  activities: AquacultureProps[];
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
        <h3 className={styles.titleInfoBox}>Aquicultura</h3>
        {activities.map((aquaculture) => (
          <div key={aquaculture.id} className={styles.infoBox}>
            <div className={styles.infoRow}>
              <div className={styles.flex1}>
                <p className={styles.label}>Cultura</p>
                <p>{aquaculture.cultura}</p>
              </div>
              <div className={styles.flex1}>
                <p className={styles.label}>Espécie</p>
                <p>{aquaculture.especie}</p>
              </div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.flex1}>
                <p className={styles.label}>quantidade</p>
                <p>{aquaculture.quantidade}</p>
              </div>
              <div className={styles.flex1}>
                <p className={styles.label}>Lâmina d'água</p>
                <p>{aquaculture.lamina_agua}</p>
              </div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.flex1}>
                <p className={styles.label}>Aptidão</p>
                {aquaculture.aptidao_corte && <p>Corte</p>}
                {aquaculture.aptidao_reproducao && <p>Reprodução</p>}
              </div>
              <div className={styles.flex1}>
                <p className={styles.label}>Tipo de criação</p>
                {aquaculture.tipo_cricao_super_intensivo && (
                  <p>Super Intensivo</p>
                )}
                {aquaculture.tipo_cricao_intensivo && <p>Intensivo</p>}
                {aquaculture.tipo_cricao_semi_intensivo && (
                  <p>Semi Intensivo</p>
                )}
                {aquaculture.tipo_cricao_extensivo && <p>Extensivo</p>}
              </div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.flex1}>
                <p className={styles.label}>Destinação venda</p>
                <p>{aquaculture.destinacao_verda}</p>
              </div>
              <div className={styles.flex1}>
                <p className={styles.label}>Valor</p>
                <p>{formatarDinheiro(aquaculture.valor_comercializacao)}</p>
              </div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.flex1}>
                <p className={styles.label}>Destinação casa</p>
                <p>{aquaculture.destinacao_casa}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
