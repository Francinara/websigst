import TemporalData from "..";
import { CraftsmanshipProps } from "../../../contexts/MapContext/types";
import {
  OptionsUnits,
  VisibilityOptionsCraftsmanship,
} from "../../../utils/types";

const VisibilityOptionsCraftsmanshipeUnits: OptionsUnits = {
  [VisibilityOptionsCraftsmanship.Property]: "",
};

const VisibilityOptionsCraftsmanshipTitles: OptionsUnits = {
  [VisibilityOptionsCraftsmanship.Property]:
    "Número de Propriedades com Cada Tipo de Produto a Cada Ano",
};

const aggregateDataCraftsmanship = (): number => {
  return 1;
};

export default function Craftsmanship({
  data,
}: {
  data: CraftsmanshipProps[];
}) {
  return (
    <TemporalData
      data={data}
      categoryType="produto"
      type="Produtos"
      aggregateData={aggregateDataCraftsmanship}
      visibilityOptions={VisibilityOptionsCraftsmanship}
      optionsUnits={VisibilityOptionsCraftsmanshipeUnits}
      optionsTitles={VisibilityOptionsCraftsmanshipTitles}
    />
  );
}
