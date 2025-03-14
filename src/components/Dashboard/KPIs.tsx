import { useEffect, useMemo, useState } from "react";
import { BeneficiariesProps } from "../../services/beneficiaries/beneficiariesApi";
import { PropertyProps } from "../../services/properties/propertiesApi";
import { VisitsProps } from "../../services/visits/visitsApi";
import { usePropertyStore } from "../../store/usePropertyStore";
import { useBeneficiaries } from "../../hooks/useBeneficiaries";
import { schemeTableau10 } from "d3";

interface KPI {
  label: string;
  value: number;
  color: string;
}

export default function KPIs({
  properties,
  visits,
}: {
  properties: PropertyProps[] | undefined;
  visits: VisitsProps[] | undefined;
}) {
  const { data: beneficiaries } = useBeneficiaries();
  const { propertiesID } = usePropertyStore();

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

  const [totalBeneficiaries, setTotalBeneficiaries] = useState(0);
  const [totalProperties, setTotalProperties] = useState(0);
  const [totalVisits, setTotalVisits] = useState(0);

  useEffect(() => {
    const filteredBeneficiaries = processedDataBeneficiarios?.filter(
      (beneficiary) =>
        beneficiary.propriedade_id !== undefined &&
        propertiesID.includes(beneficiary.propriedade_id)
    );

    const filteredProperties = properties?.filter((property) =>
      propertiesID.includes(property.id)
    );

    const filteredVisits = visits?.filter((visit) =>
      propertiesID.includes(visit.propriedade_id)
    );

    setTotalBeneficiaries(filteredBeneficiaries?.length ?? 0);
    setTotalProperties(filteredProperties?.length ?? 0);
    setTotalVisits(filteredVisits?.length ?? 0);
  }, [propertiesID, processedDataBeneficiarios, properties, visits]);

  const kpiData: KPI[] = [
    {
      label: "Propriedades",
      value: totalProperties,
      color: schemeTableau10[4],
    },
    {
      label: "Beneficiários",
      value: totalBeneficiaries,
      color: schemeTableau10[0],
    },
    { label: "Visitas", value: totalVisits, color: schemeTableau10[1] },
  ];

  return (
    <div className="flex gap-2">
      {kpiData.map((kpi) => (
        <div
          key={kpi.label}
          className={`flex-1 p-2 rounded-lg text-white text-center`}
          style={{ backgroundColor: kpi.color }}
        >
          <p className="text-2xl font-bold">{kpi.value}</p>
          <p className="text-sm">{kpi.label}</p>
        </div>
      ))}
    </div>
  );
}
