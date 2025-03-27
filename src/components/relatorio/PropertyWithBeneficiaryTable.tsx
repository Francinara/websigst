import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useProperties } from "../../hooks/useProperties";
import { useBeneficiaries } from "../../hooks/useBeneficiaries";

export default function PropertyWithBeneficiaryTable({
  setIsLoading,
}: {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}) {
  const { data: properties, isLoading } = useProperties();
  const { data: beneficiaries } = useBeneficiaries();

  const [filters, setFilters] = useState({
    distrito: "",
    nome_propriedade: "",
    area_min: "",
    area_max: "",
    comunidade: "",
    situacao_fundiaria: "",
    nome_completo: "",
    cpf: "",
    renda_familiar_min: "",
    renda_familiar_max: "",
    agricultura: "",
    pecuaria: "",
  });

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };
  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading, setIsLoading]);

  const filteredProperties = properties
    ?.map((property) => {
      const beneficiary = beneficiaries?.find(
        (b) => b.id === property.beneficiario_id
      );
      return { property, beneficiary };
    })
    .filter(({ property, beneficiary }) => {
      return (
        property.distrito
          .toLowerCase()
          .includes(filters.distrito.toLowerCase()) &&
        property.nome_propriedade
          .toLowerCase()
          .includes(filters.nome_propriedade.toLowerCase()) &&
        (filters.area_min === "" ||
          property.area >= Number(filters.area_min)) &&
        (filters.area_max === "" ||
          property.area <= Number(filters.area_max)) &&
        property.comunidade
          .toLowerCase()
          .includes(filters.comunidade.toLowerCase()) &&
        property.situacao_fundiaria
          .toLowerCase()
          .includes(filters.situacao_fundiaria.toLowerCase()) &&
        (beneficiary?.nome_completo || "")
          .toLowerCase()
          .includes(filters.nome_completo.toLowerCase()) &&
        (beneficiary?.cpf || "")
          .toLowerCase()
          .includes(filters.cpf.toLowerCase()) &&
        (filters.renda_familiar_min === "" ||
          (beneficiary?.renda_familiar || 0) >=
            Number(filters.renda_familiar_min)) &&
        (filters.renda_familiar_max === "" ||
          (beneficiary?.renda_familiar || 0) <=
            Number(filters.renda_familiar_max)) &&
        (filters.agricultura === "" ||
          (property.agricultura ? "Sim" : "Não")
            .toLowerCase()
            .includes(filters.agricultura.toLowerCase())) &&
        (filters.pecuaria === "" ||
          (property.pecuaria ? "Sim" : "Não")
            .toLowerCase()
            .includes(filters.pecuaria.toLowerCase()))
      );
    });

  return (
    <>
      <table className="w-full border-collapse border border-stone-200">
        <thead>
          <tr className="bg-stone-100">
            <th className="border-t border-x p-2">Distrito</th>
            <th className="border-t border-x p-2">Nome da Propriedade</th>
            <th className="border-t border-x p-2">Área (ha)</th>
            <th className="border-t border-x p-2">Comunidade</th>
            <th className="border-t border-x p-2">Situação Fundiária</th>
            <th className="border-t border-x p-2">Nome do Beneficiário</th>
            <th className="border-t border-x p-2">CPF</th>
            <th className="border-t border-x p-2">Renda Familiar (R$)</th>
            <th className="border-t border-x p-2">Agricultura</th>
            <th className="border-t border-x p-2">Pecuária</th>
          </tr>
          <tr className="bg-stone-100">
            <th className="border-x p-1">
              <input
                type="text"
                value={filters.distrito}
                onChange={(e) => handleFilterChange("distrito", e.target.value)}
                className="w-full p-1 border rounded font-normal"
                placeholder="Filtrar"
              />
            </th>
            <th className="border-x p-1">
              <input
                type="text"
                value={filters.nome_propriedade}
                onChange={(e) =>
                  handleFilterChange("nome_propriedade", e.target.value)
                }
                className="w-full p-1 border rounded font-normal"
                placeholder="Filtrar"
              />
            </th>
            <th className="border-x p-1">
              <div className="flex flex-col gap-1">
                <input
                  type="number"
                  value={filters.area_min}
                  onChange={(e) =>
                    handleFilterChange("area_min", e.target.value)
                  }
                  className="w-full p-1 border rounded font-normal"
                  placeholder="Mínimo"
                />
                <input
                  type="number"
                  value={filters.area_max}
                  onChange={(e) =>
                    handleFilterChange("area_max", e.target.value)
                  }
                  className="w-full p-1 border rounded font-normal"
                  placeholder="Máximo"
                />
              </div>
            </th>
            <th className="border-x p-1">
              <input
                type="text"
                value={filters.comunidade}
                onChange={(e) =>
                  handleFilterChange("comunidade", e.target.value)
                }
                className="w-full p-1 border rounded font-normal"
                placeholder="Filtrar"
              />
            </th>
            <th className="border-x p-1">
              <input
                type="text"
                value={filters.situacao_fundiaria}
                onChange={(e) =>
                  handleFilterChange("situacao_fundiaria", e.target.value)
                }
                className="w-full p-1 border rounded font-normal"
                placeholder="Filtrar"
              />
            </th>
            <th className="border-x p-1">
              <input
                type="text"
                value={filters.nome_completo}
                onChange={(e) =>
                  handleFilterChange("nome_completo", e.target.value)
                }
                className="w-full p-1 border rounded font-normal"
                placeholder="Filtrar"
              />
            </th>
            <th className="border-x p-1">
              <input
                type="text"
                value={filters.cpf}
                onChange={(e) => handleFilterChange("cpf", e.target.value)}
                className="w-full p-1 border rounded font-normal"
                placeholder="Filtrar"
              />
            </th>
            <th className="border-x p-1">
              <div className="flex flex-col gap-1">
                <input
                  type="number"
                  value={filters.renda_familiar_min}
                  onChange={(e) =>
                    handleFilterChange("renda_familiar_min", e.target.value)
                  }
                  className="w-full p-1 border rounded font-normal"
                  placeholder="Mínimo"
                />
                <input
                  type="number"
                  value={filters.renda_familiar_max}
                  onChange={(e) =>
                    handleFilterChange("renda_familiar_max", e.target.value)
                  }
                  className="w-full p-1 border rounded font-normal"
                  placeholder="Máximo"
                />
              </div>
            </th>
            <th className="border-x p-1">
              <select
                value={filters.agricultura}
                onChange={(e) =>
                  handleFilterChange("agricultura", e.target.value)
                }
                className="w-full p-1 border rounded font-normal"
              >
                <option value="">Todos</option>
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </select>
            </th>
            <th className="border-x p-1">
              <select
                value={filters.pecuaria}
                onChange={(e) => handleFilterChange("pecuaria", e.target.value)}
                className="w-full p-1 border rounded font-normal"
              >
                <option value="">Todos</option>
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </select>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredProperties?.map(({ property, beneficiary }, index) => (
            <tr key={index} className="text-center border">
              <td className="border p-2">{property.distrito}</td>
              <td className="border p-2">{property.nome_propriedade}</td>
              <td className="border p-2">{property.area}</td>
              <td className="border p-2">{property.comunidade}</td>
              <td className="border p-2">{property.situacao_fundiaria}</td>
              <td className="border p-2">
                {beneficiary?.nome_completo || "-"}
              </td>
              <td className="border p-2">{beneficiary?.cpf || "-"}</td>
              <td className="border p-2">
                {beneficiary?.renda_familiar.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) || "-"}
              </td>
              <td className="border p-2">
                {property.agricultura ? "Sim" : "Não"}
              </td>
              <td className="border p-2">
                {property.pecuaria ? "Sim" : "Não"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
