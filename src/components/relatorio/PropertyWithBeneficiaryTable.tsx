import { useState } from "react";
import { useProperties } from "../../hooks/useProperties";
import { useBeneficiaries } from "../../hooks/useBeneficiaries";

import styles from "./styles.module.scss";

export default function PropertyWithBeneficiaryTable() {
  const { data: properties, isLoading } = useProperties();
  const { data: beneficiaries } = useBeneficiaries();

  const [filters, setFilters] = useState({
    distrito: "",
    nome_propriedade: "",
    area: "",
    comunidade: "",
    situacao_fundiaria: "",
    nome_completo: "",
    cpf: "",
    renda_familiar: "",
    agricultura: "",
    pecuaria: "",
  });

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

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
        (filters.area === "" ||
          property.area.toString().includes(filters.area)) &&
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
        (filters.renda_familiar === "" ||
          (beneficiary?.renda_familiar || 0)
            .toString()
            .includes(filters.renda_familiar)) &&
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
      {isLoading ? (
        <div className={styles.loadingOverlay}>
          <div className={styles.loaderCircle}></div>
        </div>
      ) : (
        <table className="w-full border-collapse border border-stone-200">
          <thead>
            <tr className="bg-stone-100">
              <th className="border p-2">Distrito</th>
              <th className="border p-2">Nome da Propriedade</th>
              <th className="border p-2">Área (ha)</th>
              <th className="border p-2">Comunidade</th>
              <th className="border p-2">Situação Fundiária</th>
              <th className="border p-2">Nome do Beneficiário</th>
              <th className="border p-2">CPF</th>
              <th className="border p-2">Renda Familiar (R$)</th>
              <th className="border p-2">Agricultura</th>
              <th className="border p-2">Pecuária</th>
            </tr>
            <tr className="bg-stone-50">
              <th className="border p-1">
                <input
                  type="text"
                  value={filters.distrito}
                  onChange={(e) =>
                    handleFilterChange("distrito", e.target.value)
                  }
                  className="w-full p-1 border rounded font-normal"
                  placeholder="Filtrar"
                />
              </th>
              <th className="border p-1">
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
              <th className="border p-1">
                <input
                  type="text"
                  value={filters.area}
                  onChange={(e) => handleFilterChange("area", e.target.value)}
                  className="w-full p-1 border rounded font-normal"
                  placeholder="Filtrar"
                />
              </th>
              <th className="border p-1">
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
              <th className="border p-1">
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
              <th className="border p-1">
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
              <th className="border p-1">
                <input
                  type="text"
                  value={filters.cpf}
                  onChange={(e) => handleFilterChange("cpf", e.target.value)}
                  className="w-full p-1 border rounded font-normal"
                  placeholder="Filtrar"
                />
              </th>
              <th className="border p-1">
                <input
                  type="text"
                  value={filters.renda_familiar}
                  onChange={(e) =>
                    handleFilterChange("renda_familiar", e.target.value)
                  }
                  className="w-full p-1 border rounded font-normal"
                  placeholder="Filtrar"
                />
              </th>
              <th className="border p-1">
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
              <th className="border p-1">
                <select
                  value={filters.pecuaria}
                  onChange={(e) =>
                    handleFilterChange("pecuaria", e.target.value)
                  }
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
      )}
    </>
  );
}
