import TemporalData from "..";
import { AquacultureProps } from "../../../contexts/MapContext/types";
import {
  OptionsUnits,
  ProductiveActivities,
  VisibilityOptions,
  VisibilityOptionsAquaculture,
} from "../../../utils/types";

const VisibilityOptionsAquacultureUnits: OptionsUnits = {
  [VisibilityOptionsAquaculture.Property]: "",
  [VisibilityOptionsAquaculture.Production]: "",
  [VisibilityOptionsAquaculture.SaleValue]: "R$",
  [VisibilityOptionsAquaculture.CultivationArea]: "ha",
};

const VisibilityOptionsAquacultureTitles: OptionsUnits = {
  [VisibilityOptionsAquaculture.Property]:
    "Número de Propriedades com Cada Tipo de Espécie a Cada Ano",
  [VisibilityOptionsAquaculture.Production]:
    "Produção Anual Total por Tipo de Espécie",
  [VisibilityOptionsAquaculture.SaleValue]:
    "Estimativa Anul de Valor Total de Vendas por Espécie",
  [VisibilityOptionsAquaculture.CultivationArea]:
    "Lâmina D'água Total Utilizada por Espécie a Cada Ano",
};

const aggregateDataAquaculture = (
  item: ProductiveActivities,
  option: VisibilityOptions
): number => {
  switch (option) {
    case VisibilityOptionsAquaculture.Production:
      return "quantidade" in item ? item.quantidade : 0;
    case VisibilityOptionsAquaculture.SaleValue:
      return "destinacao_verda" in item && "valor_comercializacao" in item
        ? item.destinacao_verda * item.valor_comercializacao
        : 0;
    case VisibilityOptionsAquaculture.CultivationArea: {
      const match =
        "lamina_agua" in item ? item.lamina_agua.match(/(\d+(\.\d+)?)/) : 0;
      const hectares = match ? parseFloat(match[0]) : 0;
      return hectares;
    }
    default:
      return 1;
  }
};

export default function Aquaculture({ data }: { data: AquacultureProps[] }) {
  return (
    <TemporalData
      data={data}
      categoryType="especie"
      type="Espécies"
      aggregateData={aggregateDataAquaculture}
      visibilityOptions={VisibilityOptionsAquaculture}
      optionsUnits={VisibilityOptionsAquacultureUnits}
      optionsTitles={VisibilityOptionsAquacultureTitles}
    />
  );
}
