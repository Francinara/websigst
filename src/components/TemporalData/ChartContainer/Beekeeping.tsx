import TemporalData from "..";
import { BeekeepingProps } from "../../../contexts/MapContext/types";
import {
  newDataBeekeepingProps,
  OptionsUnits,
  ProductiveActivities,
  VisibilityOptions,
  VisibilityOptionsBeekeeping,
} from "../../../utils/types";

const VisibilityOptionsBeekeepingUnits: OptionsUnits = {
  [VisibilityOptionsBeekeeping.Property]: "",
  [VisibilityOptionsBeekeeping.Hives]: "",
};

const VisibilityOptionsBeekeepingTitles: OptionsUnits = {
  [VisibilityOptionsBeekeeping.Property]:
    "Número de Propriedades com Cada Tipo de Espécie a Cada Ano",
  [VisibilityOptionsBeekeeping.Hives]:
    "Número Anual Total de Colmeias por Espécie",
};

const aggregateDataBeekeeping = (
  item: ProductiveActivities,
  option: VisibilityOptions
): number => {
  switch (option) {
    case VisibilityOptionsBeekeeping.Hives:
      return "n_colmeias" in item ? item.n_colmeias : 0;
    default:
      return 1;
  }
};

export default function Beekeeping({ data }: { data: BeekeepingProps[] }) {
  const newData: newDataBeekeepingProps[] = data.flatMap((item) => {
    const resultado = [];

    if (item.com_ferrao) {
      resultado.push({ ...item, especie: "Com Ferrão" });
    }

    if (item.sem_ferrao) {
      resultado.push({ ...item, especie: "Sem Ferrão" });
    }

    return resultado;
  });
  return (
    <TemporalData
      data={newData}
      categoryType={"especie"}
      type="Espécies"
      aggregateData={aggregateDataBeekeeping}
      visibilityOptions={VisibilityOptionsBeekeeping}
      optionsUnits={VisibilityOptionsBeekeepingUnits}
      optionsTitles={VisibilityOptionsBeekeepingTitles}
    />
  );
}
