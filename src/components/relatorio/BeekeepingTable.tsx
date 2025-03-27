import { useState, useRef, useEffect, Dispatch, SetStateAction } from "react";
import { useDebounce } from "use-debounce";
import { useProductiveActivities } from "../../hooks/useActiviteProductivies";
import { BeekeepingProps } from "../../services/productive-activities/productiveActivitiesApi";
import { activityAcess } from "../../utils/constants";

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

export default function BeekeepingTable({
  setIsLoading,
}: {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}) {
  const [filters, setFilters] = useState({
    distrito: "",
    n_colmeias_min: "",
    n_colmeias_max: "",
    destinacao_mel: "",
    com_ferrao: "",
    sem_ferrao: "",
    data: "",
    data_inicio: "",
    data_fim: "",
  });

  const visitsRef = useRef<BeekeepingProps[]>([]);
  const [displayedVisits, setDisplayedVisits] = useState<BeekeepingProps[]>([]);

  const convertedFilters = {
    ...filters,
    n_colmeias_min: filters.n_colmeias_min
      ? Number(filters.n_colmeias_min)
      : undefined,
    n_colmeias_max: filters.n_colmeias_max
      ? Number(filters.n_colmeias_max)
      : undefined,
    com_ferrao:
      filters.com_ferrao === "Sim"
        ? true
        : filters.com_ferrao === "Não"
        ? false
        : undefined,
    sem_ferrao:
      filters.sem_ferrao === "Sim"
        ? true
        : filters.sem_ferrao === "Não"
        ? false
        : undefined,
  };

  const [debouncedFilters] = useDebounce(convertedFilters, 500);
  const { data: activities, isLoading } = useProductiveActivities(
    activityAcess.beekeeping,
    debouncedFilters
  );

  useEffect(() => {
    if (activities) {
      visitsRef.current = activities as BeekeepingProps[];
      setDisplayedVisits(activities as BeekeepingProps[]);
    }
  }, [activities]);

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading, setIsLoading]);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredActivities = displayedVisits.filter((bee) => {
    const visitDate = new Date(bee.data ?? "");
    const dataInicio = filters.data_inicio
      ? new Date(filters.data_inicio)
      : null;
    const dataFim = filters.data_fim ? new Date(filters.data_fim) : null;

    return (
      bee.distrito.toLowerCase().includes(filters.distrito.toLowerCase()) &&
      (filters.n_colmeias_min === "" ||
        bee.n_colmeias >= Number(filters.n_colmeias_min)) &&
      (filters.n_colmeias_max === "" ||
        bee.n_colmeias <= Number(filters.n_colmeias_max)) &&
      bee.destinacao_mel
        .toLowerCase()
        .includes(filters.destinacao_mel.toLowerCase()) &&
      (filters.com_ferrao === "" ||
        (bee.com_ferrao ? "Sim" : "Não")
          .toLowerCase()
          .includes(filters.com_ferrao.toLowerCase())) &&
      (filters.sem_ferrao === "" ||
        (bee.sem_ferrao ? "Sim" : "Não")
          .toLowerCase()
          .includes(filters.sem_ferrao.toLowerCase())) &&
      (filters.data === "" ||
        formatDate(bee.data).includes(filters.data.toLowerCase())) &&
      (!dataInicio || visitDate >= dataInicio) &&
      (!dataFim || visitDate <= dataFim)
    );
  });

  return (
    <>
      <table className="w-full border-collapse border border-stone-200">
        <thead>
          <tr className="bg-stone-100">
            <th className="border-t border-x p-2">Distrito</th>
            <th className="border-t border-x p-2">Nº Colmeias</th>
            <th className="border-t border-x p-2">Destinação Mel</th>
            <th className="border-t border-x p-2">Com Ferrão</th>
            <th className="border-t border-x p-2">Sem Ferrão</th>
            <th className="border-t border-x p-2">Data da Visita</th>
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
              <div className="flex flex-col gap-1">
                <input
                  type="number"
                  value={filters.n_colmeias_min}
                  onChange={(e) =>
                    handleFilterChange("n_colmeias_min", e.target.value)
                  }
                  className="w-full p-1 border rounded font-normal"
                  placeholder="Mínimo"
                />
                <input
                  type="number"
                  value={filters.n_colmeias_max}
                  onChange={(e) =>
                    handleFilterChange("n_colmeias_max", e.target.value)
                  }
                  className="w-full p-1 border rounded font-normal"
                  placeholder="Máximo"
                />
              </div>
            </th>
            <th className="border-x p-1">
              <input
                type="text"
                value={filters.destinacao_mel}
                onChange={(e) =>
                  handleFilterChange("destinacao_mel", e.target.value)
                }
                className="w-full p-1 border rounded font-normal"
                placeholder="Filtrar"
              />
            </th>
            <th className="border-x p-1">
              <select
                value={filters.com_ferrao}
                onChange={(e) =>
                  handleFilterChange("com_ferrao", e.target.value)
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
                value={filters.sem_ferrao}
                onChange={(e) =>
                  handleFilterChange("sem_ferrao", e.target.value)
                }
                className="w-full p-1 border rounded font-normal"
              >
                <option value="">Todos</option>
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </select>
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
                  onChange={(e) =>
                    handleFilterChange("data_fim", e.target.value)
                  }
                  className="w-full p-1 border rounded font-normal"
                />
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredActivities?.map((bee, index) => (
            <tr key={index} className="text-center border">
              <td className="border p-2">{bee.distrito}</td>
              <td className="border p-2">{bee.n_colmeias}</td>
              <td className="border p-2">{bee.destinacao_mel}</td>
              <td className="border p-2">{bee.com_ferrao ? "Sim" : "Não"}</td>
              <td className="border p-2">{bee.sem_ferrao ? "Sim" : "Não"}</td>
              <td className="border p-2">{formatDate(bee.data)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
