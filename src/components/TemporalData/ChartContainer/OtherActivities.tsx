import TemporalData from "..";
import { OtherActivitiesProps } from "../../../contexts/MapContext/types";
import {
  OptionsUnits,
  VisibilityOptionsOtherActivities,
} from "../../../utils/types";

const VisibilityOptionsOtherActivitiesUnits: OptionsUnits = {
  [VisibilityOptionsOtherActivities.Property]: "",
};

const VisibilityOptionsOtherActivitiesTitles: OptionsUnits = {
  [VisibilityOptionsOtherActivities.Property]:
    "Número de Propriedades com Cada Tipo de Atividade a Cada Ano",
};

const aggregateDataOtherActivities = (): number => {
  return 1;
};

export default function OtherActivities({
  data,
}: {
  data: OtherActivitiesProps[];
}) {
  return (
    <TemporalData
      data={data}
      categoryType="tipo"
      type="Tipos"
      aggregateData={aggregateDataOtherActivities}
      visibilityOptions={VisibilityOptionsOtherActivities}
      optionsUnits={VisibilityOptionsOtherActivitiesUnits}
      optionsTitles={VisibilityOptionsOtherActivitiesTitles}
    />
  );
}
