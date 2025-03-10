import { WaterResourceByPropertyProps } from "../../../../contexts/MapContext/types";
import styles from "../styles.module.scss";

export default function WaterResources({
  waterResources,
}: {
  waterResources: WaterResourceByPropertyProps[];
}) {
  return (
    <>
      {waterResources.map((waterResource) => (
        <div key={waterResource.id} className={styles.contentContainer}>
          {waterResource.cisternas_id && (
            <div className={styles.infoBoxContainer}>
              <h3 className={styles.titleInfoBox}> Cisterna</h3>
              <div className={styles.infoBox}>
                <div>
                  <div className={styles.infoRow}>
                    <div className={styles.flex1}>
                      <p className={styles.label}>Tipo</p>
                      <p>{waterResource.tipo_cisterna}</p>
                    </div>
                    <div className={styles.flex1}>
                      <p className={styles.label}>Capacidade</p>
                      <p>{waterResource.capacidade_cisterna}L</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {waterResource.carro_pipa_id && (
            <div className={styles.infoBoxContainer}>
              <h3 className={styles.titleInfoBox}>Carro Pipa</h3>
              <div className={styles.infoBox}>
                <div>
                  <div className={styles.infoRow}>
                    <div className={styles.flex1}>
                      <p className={styles.label}>Fornecedor</p>
                      <p>{waterResource.fornecedor_carro_pipa}</p>
                    </div>
                    <div className={styles.flex1}>
                      <p className={styles.label}>Quantidade/mês</p>
                      <p>{waterResource.quantidade_mes_litro}L</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {waterResource.poco_id && (
            <div className={styles.infoBoxContainer}>
              <h3 className={styles.titleInfoBox}>Poço</h3>
              <div className={styles.infoBox}>
                <div className={styles.infoRow}>
                  <div className={styles.flex1}>
                    <p className={styles.label}>Propriedade</p>
                    <p>{waterResource.propriedade_poco}</p>
                  </div>
                  <div className={styles.flex1}>
                    <p className={styles.label}>Qualidade</p>
                    <p>{waterResource.qualidade_poco}</p>
                  </div>
                </div>
                <div className={styles.infoRow}>
                  <div className={styles.flex1}>
                    <p className={styles.label}>Bomba</p>
                    {waterResource.bomba_poco ? <p>Sim</p> : <p>Não</p>}
                  </div>
                  <div className={styles.flex1}>
                    <p className={styles.label}>Vazão</p>
                    <p>{waterResource.vazao_poco}L</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {waterResource.poco_amazonas_id && (
            <div className={styles.infoBoxContainer}>
              <h3 className={styles.titleInfoBox}> Poço Amazonas</h3>
              <div className={styles.infoBox}>
                <div className={styles.infoRow}>
                  <div className={styles.flex1}>
                    <p className={styles.label}>Propriedade</p>
                    <p>{waterResource.propriedade_poco_amazonas}</p>
                  </div>
                  <div className={styles.flex1}>
                    <p className={styles.label}>Qualidade</p>
                    <p>{waterResource.qualidade_poco_amazonas}</p>
                  </div>
                </div>
                <div className={styles.infoRow}>
                  <div className={styles.flex1}>
                    <p className={styles.label}>Bomba</p>
                    {waterResource.bomba_poco_amazonas ? (
                      <p>Sim</p>
                    ) : (
                      <p>Não</p>
                    )}
                  </div>
                  <div className={styles.flex1}>
                    <p className={styles.label}>Vazão</p>
                    <p>{waterResource.vazao_poco_amazonas}L</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {waterResource.acude_id && (
            <div className={styles.infoBoxContainer}>
              <h3 className={styles.titleInfoBox}> Açude</h3>
              <div className={styles.infoBox}>
                <div>
                  <div className={styles.infoRow}>
                    <div className={styles.flex1}>
                      <p className={styles.label}>Propriedade</p>
                      <p>{waterResource.propriedade_acude}</p>
                    </div>
                    <div className={styles.flex1}>
                      <p className={styles.label}>Capacidade</p>
                      <p>{waterResource.capacidade_acude}L</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {waterResource.barragem_id && (
            <div className={styles.infoBoxContainer}>
              <h3 className={styles.titleInfoBox}> Barragem</h3>
              <div className={styles.infoBox}>
                <div>
                  <div className={styles.infoRow}>
                    <div className={styles.flex1}>
                      <p className={styles.label}>Propriedade</p>
                      <p>{waterResource.propriedade_barragem}</p>
                    </div>
                    <div className={styles.flex1}>
                      <p className={styles.label}>Capacidade</p>
                      <p>{waterResource.capacidade_barragem}L</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {waterResource.banheiro_id && (
            <div className={styles.infoBoxContainer}>
              <h3 className={styles.titleInfoBox}> Banheiro</h3>
              <div className={styles.infoBox}>
                <div>
                  <div className={styles.infoRow}>
                    <div className={styles.flex1}>
                      <p className={styles.label}>Nº de banheiros</p>
                      <p>{waterResource.n_banheiros}</p>
                    </div>
                    <div className={styles.flex1}>
                      <p className={styles.label}>Fossa</p>
                      {waterResource.fossa ? <p>Sim</p> : <p>Não</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  );
}
