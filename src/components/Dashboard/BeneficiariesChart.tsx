import { useEffect, useMemo, useRef, useState } from "react";
import {
  CompleteProductiveActivity,
  VisibilityOptionsAgriculture,
} from "../../utils/types";
import { usePropertyStore } from "../../store/usePropertyStore";
import { BeneficiariesProps } from "../../services/beneficiaries/beneficiariesApi";
import { useBeneficiaries } from "../../hooks/useBeneficiaries";
import { useProperties } from "../../hooks/useProperties";
import LegendTest from "../MapContent/Charts/LegendTest";
import TextCard from "./TextCard";
import BarChart from "./charts/BarChart";

export default function BeneficiariesChart() {
  const { data: beneficiaries } = useBeneficiaries();
  const { data: properties } = useProperties();
  const { propertiesID } = usePropertyStore();
  const chartRef = useRef<HTMLDivElement>(null);

  const [malePercentage, setMalePercentage] = useState("0");
  const [femalePercentage, setFemalePercentage] = useState("0");
  const [otherPercentage, setOtherPercentage] = useState("0");
  const [rendaFamiliarMedia, setRendaFamiliarMedia] = useState("R$ 0,00");

  const processBeneficiarioData = (data: BeneficiariesProps[] | undefined) => {
    return data?.map((beneficiario) => {
      const matchingProperty = properties?.find(
        (item) => beneficiario.id === item.beneficiario_id
      );

      if (matchingProperty) {
        return {
          ...beneficiario,
          propriedade_id: matchingProperty.id,
          tipo_credito_rural: beneficiario.tipo_credito_rural ?? "não possui",
        };
      }
      return {
        ...beneficiario,
        tipo_credito_rural: beneficiario.tipo_credito_rural ?? "não possui",
      };
    });
  };

  const processedDataBeneficiarios = useMemo(
    () => processBeneficiarioData(beneficiaries),
    [beneficiaries, propertiesID]
  );

  useEffect(() => {
    const filteredBeneficiaries = processedDataBeneficiarios?.filter(
      (beneficiary) =>
        propertiesID.some((property) => beneficiary.propriedade_id == property)
    );

    const genderStats = filteredBeneficiaries?.reduce(
      (acc, beneficiary) => {
        if (beneficiary.sexo === "Masculino") acc.male++;
        else if (beneficiary.sexo === "Feminino") acc.female++;
        else acc.other++;
        return acc;
      },
      { male: 0, female: 0, other: 0 }
    ) || { male: 0, female: 0, other: 0 };

    const total = filteredBeneficiaries?.length || 0;

    setMalePercentage(
      total ? ((genderStats.male / total) * 100).toFixed(0) : "0"
    );
    setFemalePercentage(
      total ? ((genderStats.female / total) * 100).toFixed(0) : "0"
    );
    setOtherPercentage(
      total ? ((genderStats.other / total) * 100).toFixed(0) : "0"
    );

    const totalIncome =
      filteredBeneficiaries?.reduce(
        (acc, beneficiary) => acc + (beneficiary.renda_familiar || 0),
        0
      ) || 0;

    const averageIncome = total
      ? new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(totalIncome / total)
      : "R$ 0,00";

    setRendaFamiliarMedia(averageIncome);
  }, [processedDataBeneficiarios, propertiesID]);

  return (
    <>
      <TextCard
        title="Beneficiários"
        text={`Masculino: ${malePercentage}% | Feminino: ${femalePercentage}% | Outros: ${otherPercentage}% \nRenda Média: ${rendaFamiliarMedia}`}
      />
      <div ref={chartRef} className="flex gap-3">
        <div className="flex flex-col  p-3 bg-white rounded-lg border flex-1">
          <h2 className="text-base font-semibold text-gray-600 mb-4">
            Programas Governamentais
          </h2>
          <div className="flex flex-col items-center justify-center h-full flex-1 ">
            {processedDataBeneficiarios && (
              <>
                <BarChart
                  chartRef={chartRef}
                  height={100}
                  marginLeft={30}
                  datas={
                    processedDataBeneficiarios as CompleteProductiveActivity[]
                  }
                  selectedChart=""
                  chartName="Quantidade de propriedades por Cultura"
                  field="programa_governamental"
                  countLogic={(items) => items.length}
                  VisibilityOptionsAgriculture={
                    VisibilityOptionsAgriculture.Property
                  }
                  label="Famílias"
                />
                <div className="flex justify-center w-full">
                  <LegendTest
                    datas={
                      processedDataBeneficiarios as CompleteProductiveActivity[]
                    }
                    selectedChart=""
                    field="programa_governamental"
                  />
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col  p-3 bg-white rounded-lg border flex-1">
          <h2 className="text-base font-semibold text-gray-600 mb-4">
            Crédito Agricola
          </h2>
          <div className="flex flex-col items-center justify-center h-full flex-1 ">
            {processedDataBeneficiarios && (
              <>
                <BarChart
                  chartRef={chartRef}
                  height={100}
                  marginLeft={30}
                  datas={
                    processedDataBeneficiarios as CompleteProductiveActivity[]
                  }
                  selectedChart=""
                  chartName="Quantidade de propriedades por Cultura"
                  field="tipo_credito_rural"
                  countLogic={(items) => items.length}
                  VisibilityOptionsAgriculture={
                    VisibilityOptionsAgriculture.Property
                  }
                  label="Famílias"
                />
                <div className="flex justify-center w-full">
                  <LegendTest
                    datas={
                      processedDataBeneficiarios as CompleteProductiveActivity[]
                    }
                    selectedChart=""
                    field="tipo_credito_rural"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
