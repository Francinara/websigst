import { useState } from "react";
import { useVisits } from "../../hooks/useVisits";
import styles from "./styles.module.scss";

export default function VisitsTable() {
  const { data: visits, isLoading } = useVisits();
  const [filters, setFilters] = useState({
    numero: "",
    data: "",
    tecnico_responsavel: "",
    data_ultima_visita: "",
    diagnostico: "",
    recomendacoes: "",
    finalidade_visita: "",
  });

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredVisits = visits?.filter((visit) => {
    return (
      (filters.numero === "" ||
        visit.numero.toString().includes(filters.numero)) &&
      (visit.data ?? "").toLowerCase().includes(filters.data.toLowerCase()) &&
      (visit.tecnico_responsavel ?? "")
        .toLowerCase()
        .includes(filters.tecnico_responsavel.toLowerCase()) &&
      (visit.data_ultima_visita ?? "")
        .toLowerCase()
        .includes(filters.data_ultima_visita.toLowerCase()) &&
      (visit.diagnostico ?? "")
        .toLowerCase()
        .includes(filters.diagnostico.toLowerCase()) &&
      (visit.recomendacoes ?? "")
        .toLowerCase()
        .includes(filters.recomendacoes.toLowerCase()) &&
      (visit.finalidade_visita ?? "")
        .toLowerCase()
        .includes(filters.finalidade_visita.toLowerCase())
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
              <th className="border p-2">Número</th>
              <th className="border p-2">Data</th>
              <th className="border p-2">Técnico Responsável</th>
              <th className="border p-2">Data Última Visita</th>
              <th className="border p-2">Diagnóstico</th>
              <th className="border p-2">Recomendações</th>
              <th className="border p-2">Finalidade da Visita</th>
            </tr>
            <tr className="bg-stone-50">
              <th className="border p-1">
                <input
                  type="text"
                  value={filters.numero}
                  onChange={(e) => handleFilterChange("numero", e.target.value)}
                  className="w-full p-1 border rounded font-normal"
                  placeholder="Filtrar"
                />
              </th>
              <th className="border p-1">
                <input
                  type="text"
                  value={filters.data}
                  onChange={(e) => handleFilterChange("data", e.target.value)}
                  className="w-full p-1 border rounded font-normal"
                  placeholder="Filtrar"
                />
              </th>
              <th className="border p-1">
                <input
                  type="text"
                  value={filters.tecnico_responsavel}
                  onChange={(e) =>
                    handleFilterChange("tecnico_responsavel", e.target.value)
                  }
                  className="w-full p-1 border rounded font-normal"
                  placeholder="Filtrar"
                />
              </th>
              <th className="border p-1">
                <input
                  type="text"
                  value={filters.data_ultima_visita}
                  onChange={(e) =>
                    handleFilterChange("data_ultima_visita", e.target.value)
                  }
                  className="w-full p-1 border rounded font-normal"
                  placeholder="Filtrar"
                />
              </th>
              <th className="border p-1">
                <input
                  type="text"
                  value={filters.diagnostico}
                  onChange={(e) =>
                    handleFilterChange("diagnostico", e.target.value)
                  }
                  className="w-full p-1 border rounded font-normal"
                  placeholder="Filtrar"
                />
              </th>
              <th className="border p-1">
                <input
                  type="text"
                  value={filters.recomendacoes}
                  onChange={(e) =>
                    handleFilterChange("recomendacoes", e.target.value)
                  }
                  className="w-full p-1 border rounded font-normal"
                  placeholder="Filtrar"
                />
              </th>
              <th className="border p-1">
                <input
                  type="text"
                  value={filters.finalidade_visita}
                  onChange={(e) =>
                    handleFilterChange("finalidade_visita", e.target.value)
                  }
                  className="w-full p-1 border rounded font-normal"
                  placeholder="Filtrar"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredVisits?.map((visit, index) => (
              <tr key={index} className="text-center border">
                <td className="border p-2">{visit.numero}</td>
                <td className="border p-2">{visit.data || "-"}</td>
                <td className="border p-2">
                  {visit.tecnico_responsavel || "-"}
                </td>
                <td className="border p-2">
                  {visit.data_ultima_visita || "-"}
                </td>
                <td className="border p-2">{visit.diagnostico || "-"}</td>
                <td className="border p-2">{visit.recomendacoes || "-"}</td>
                <td className="border p-2">{visit.finalidade_visita || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
