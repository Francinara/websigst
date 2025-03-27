import { useState, useRef, useEffect, Dispatch, SetStateAction } from "react";
import { useDebounce } from "use-debounce";
import { useVisits } from "../../hooks/useVisits";
import { VisitsProps } from "../../services/visits/visitsApi";

const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export default function VisitsTable({
  setIsLoading,
}: {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}) {
  const [filters, setFilters] = useState({
    numero: "",
    data: "",
    data_inicio: "",
    data_fim: "",
    tecnico_responsavel: "",
    data_ultima_visita: "",
    data_ultima_visita_inicio: "",
    data_ultima_visita_fim: "",
    diagnostico: "",
    recomendacoes: "",
    finalidade_visita: "",
  });

  const visitsRef = useRef<VisitsProps[]>([]);
  const [displayedVisits, setDisplayedVisits] = useState<VisitsProps[]>([]);

  const convertedFilters = {
    ...filters,
    numero: filters.numero ? parseInt(filters.numero, 10) : undefined,
  };

  const [debouncedFilters] = useDebounce(convertedFilters, 500);
  const { data: visits, isLoading } = useVisits(debouncedFilters);

  useEffect(() => {
    if (visits) {
      visitsRef.current = visits;
      setDisplayedVisits(visits);
    }
  }, [visits]);

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading, setIsLoading]);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredVisits = displayedVisits.filter((visit) => {
    const visitData = new Date(visit.data ?? "");
    const visitUltimaData = new Date(visit.data_ultima_visita ?? "");
    const dataInicio = filters.data_inicio
      ? new Date(filters.data_inicio)
      : null;
    const dataFim = filters.data_fim ? new Date(filters.data_fim) : null;
    const ultimaVisitaInicio = filters.data_ultima_visita_inicio
      ? new Date(filters.data_ultima_visita_inicio)
      : null;
    const ultimaVisitaFim = filters.data_ultima_visita_fim
      ? new Date(filters.data_ultima_visita_fim)
      : null;

    return (
      (filters.numero === "" ||
        visit.numero.toString().includes(filters.numero)) &&
      (filters.data === "" ||
        (visit.data ?? "")
          .toLowerCase()
          .includes(filters.data.toLowerCase())) &&
      (!dataInicio || visitData >= dataInicio) &&
      (!dataFim || visitData <= dataFim) &&
      (filters.tecnico_responsavel === "" ||
        (visit.tecnico_responsavel ?? "")
          .toLowerCase()
          .includes(filters.tecnico_responsavel.toLowerCase())) &&
      (filters.data_ultima_visita === "" ||
        (visit.data_ultima_visita ?? "")
          .toLowerCase()
          .includes(filters.data_ultima_visita.toLowerCase())) &&
      (!ultimaVisitaInicio || visitUltimaData >= ultimaVisitaInicio) &&
      (!ultimaVisitaFim || visitUltimaData <= ultimaVisitaFim) &&
      (filters.diagnostico === "" ||
        (visit.diagnostico ?? "")
          .toLowerCase()
          .includes(filters.diagnostico.toLowerCase())) &&
      (filters.recomendacoes === "" ||
        (visit.recomendacoes ?? "")
          .toLowerCase()
          .includes(filters.recomendacoes.toLowerCase())) &&
      (filters.finalidade_visita === "" ||
        (visit.finalidade_visita ?? "")
          .toLowerCase()
          .includes(filters.finalidade_visita.toLowerCase()))
    );
  });

  return (
    <table className="w-full border-collapse border border-stone-200">
      <thead>
        <tr className="bg-stone-100">
          <th className="border-t border-x p-2">Número</th>
          <th className="border-t border-x p-2">Data</th>
          <th className="border-t border-x p-2">Técnico Responsável</th>
          <th className="border-t border-x p-2">Data Última Visita</th>
          <th className="border-t border-x p-2">Diagnóstico</th>
          <th className="border-t border-x p-2">Recomendações</th>
          <th className="border-t border-x p-2">Finalidade da Visita</th>
        </tr>
        <tr className="bg-stone-100">
          <th className="border-x p-1">
            <input
              type="text"
              value={filters.numero}
              onChange={(e) => handleFilterChange("numero", e.target.value)}
              className="w-full p-1 border rounded font-normal"
              placeholder="Buscar"
            />
          </th>
          <th className="border-x p-1">
            <div className="flex flex-col gap-1">
              <input
                type="date"
                value={filters.data_inicio}
                onChange={(e) =>
                  handleFilterChange("data_inicio", e.target.value)
                }
                className="w-full p-1 border rounded font-normal"
              />
              <input
                type="date"
                value={filters.data_fim}
                onChange={(e) => handleFilterChange("data_fim", e.target.value)}
                className="w-full p-1 border rounded font-normal"
              />
            </div>
          </th>
          <th className="border-x p-1">
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
          <th className="border-x p-1">
            <div className="flex flex-col gap-1">
              <input
                type="date"
                value={filters.data_ultima_visita_inicio}
                onChange={(e) =>
                  handleFilterChange(
                    "data_ultima_visita_inicio",
                    e.target.value
                  )
                }
                className="w-full p-1 border rounded font-normal"
              />
              <input
                type="date"
                value={filters.data_ultima_visita_fim}
                onChange={(e) =>
                  handleFilterChange("data_ultima_visita_fim", e.target.value)
                }
                className="w-full p-1 border rounded font-normal"
              />
            </div>
          </th>
          <th className="border-x p-1">
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
          <th className="border-x p-1">
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
          <th className="border-x p-1">
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
            <td className="border p-2">{formatDate(visit.data)}</td>
            <td className="border p-2">{visit.tecnico_responsavel || "-"}</td>
            <td className="border p-2">
              {formatDate(visit.data_ultima_visita)}
            </td>
            <td className="border p-2">{visit.diagnostico || "-"}</td>
            <td className="border p-2">{visit.recomendacoes || "-"}</td>
            <td className="border p-2">{visit.finalidade_visita || "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
