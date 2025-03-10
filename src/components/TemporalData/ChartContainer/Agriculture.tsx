import TemporalData from "..";
import { AgricultureProps } from "../../../contexts/MapContext/types";
import {
  OptionsUnits,
  ProductiveActivities,
  VisibilityOptions,
  VisibilityOptionsAgriculture,
} from "../../../utils/types";

const VisibilityOptionsAgricultureUnits: OptionsUnits = {
  [VisibilityOptionsAgriculture.Property]: "",
  [VisibilityOptionsAgriculture.Production]: "",
  [VisibilityOptionsAgriculture.SaleValue]: "R$",
  [VisibilityOptionsAgriculture.CultivationArea]: "ha",
};
const VisibilityOptionsAgricultureTitles: OptionsUnits = {
  [VisibilityOptionsAgriculture.Property]:
    "Número de Propriedades com Cada Tipo de Cultura a Cada Ano",
  [VisibilityOptionsAgriculture.Production]:
    "Produção Anual Total por Tipo de Cultura",
  [VisibilityOptionsAgriculture.SaleValue]:
    "Estimativa Anul de Valor Total de Vendas por Cultura",
  [VisibilityOptionsAgriculture.CultivationArea]:
    "Área de Cultivo Total Utilizada por Cultura a Cada Ano",
};

const aggregateDataAgriculture = (
  item: ProductiveActivities,
  option: VisibilityOptions
): number => {
  switch (option) {
    case VisibilityOptionsAgriculture.Production:
      return "producao_ano" in item ? item.producao_ano : 0;
    case VisibilityOptionsAgriculture.SaleValue:
      return "destinacao_venda" in item && "valor_comercializado" in item
        ? item.destinacao_venda * item.valor_comercializado
        : 0;
    case VisibilityOptionsAgriculture.CultivationArea:
      return "area_cultivo" in item ? item.area_cultivo : 0;
    default:
      return 1;
  }
};

export default function Agriculture({ data }: { data: AgricultureProps[] }) {
  return (
    <TemporalData
      data={data}
      categoryType="cultura"
      type="Culturas"
      aggregateData={aggregateDataAgriculture}
      visibilityOptions={VisibilityOptionsAgriculture}
      optionsUnits={VisibilityOptionsAgricultureUnits}
      optionsTitles={VisibilityOptionsAgricultureTitles}
    />
  );
}
