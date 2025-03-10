import TemporalData from "..";
import { LivestockProps } from "../../../contexts/MapContext/types";
import {
  OptionsUnits,
  ProductiveActivities,
  VisibilityOptions,
  VisibilityOptionsLivestock,
} from "../../../utils/types";

const VisibilityOptionsLivestockUnits: OptionsUnits = {
  [VisibilityOptionsLivestock.Property]: "",
  [VisibilityOptionsLivestock.Specie]: "",
  [VisibilityOptionsLivestock.SaleValue]: "R$",
};

const VisibilityOptionsLivestockTitles: OptionsUnits = {
  [VisibilityOptionsLivestock.Property]:
    "Número de Propriedades com Cada Tipo de Espécie a Cada Ano",
  [VisibilityOptionsLivestock.Specie]:
    "Produção Anual Total por Tipo de Espécie",
  [VisibilityOptionsLivestock.SaleValue]:
    "Estimativa Anul de Valor Total de Vendas por Espécie",
};

const aggregateDataLivestock = (
  item: ProductiveActivities,
  option: VisibilityOptions
): number => {
  switch (option) {
    case VisibilityOptionsLivestock.Specie:
      return "quantidade" in item ? item.quantidade : 0;
    case VisibilityOptionsLivestock.SaleValue:
      return "destinacao_venda" in item && "valor_comercializacao" in item
        ? item.destinacao_venda * item.valor_comercializacao
        : 0;
    default:
      return 1;
  }
};

export default function Livestock({ data }: { data: LivestockProps[] }) {
  return (
    <TemporalData
      data={data}
      categoryType="especie"
      type="Espécies"
      aggregateData={aggregateDataLivestock}
      visibilityOptions={VisibilityOptionsLivestock}
      optionsUnits={VisibilityOptionsLivestockUnits}
      optionsTitles={VisibilityOptionsLivestockTitles}
    />
  );
}
