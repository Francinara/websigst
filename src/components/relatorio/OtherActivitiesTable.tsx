import { useState, useRef, useEffect, Dispatch, SetStateAction } from "react";
import { useDebounce } from "use-debounce";
import { useProductiveActivities } from "../../hooks/useActiviteProductivies";
import { OtherActivitiesProps } from "../../services/productive-activities/productiveActivitiesApi";
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

export default function OtherActivitiesTable({
  setIsLoading,
}: {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}) {
  const [filters, setFilters] = useState({
    distrito: "",
    tipo: "",
    descricao: "",
    data: "",
    data_inicio: "",
    data_fim: "",
  });

  const visitsRef = useRef<OtherActivitiesProps[]>([]);
  const [displayedVisits, setDisplayedVisits] = useState<
    OtherActivitiesProps[]
  >([]);

  const convertedFilters = { ...filters };

  const [debouncedFilters] = useDebounce(convertedFilters, 500);
  const { data: activities, isLoading } = useProductiveActivities(
    activityAcess.other_activities,
    debouncedFilters
  );

  useEffect(() => {
    if (activities) {
      visitsRef.current = activities as OtherActivitiesProps[];
      setDisplayedVisits(activities as OtherActivitiesProps[]);
    }
  }, [activities]);

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading, setIsLoading]);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredActivities = displayedVisits.filter((other) => {
    const visitDate = new Date(other.data ?? "");
    const dataInicio = filters.data_inicio
      ? new Date(filters.data_inicio)
      : null;
    const dataFim = filters.data_fim ? new Date(filters.data_fim) : null;

    return (
      other.distrito.toLowerCase().includes(filters.distrito.toLowerCase()) &&
      other.tipo.toLowerCase().includes(filters.tipo.toLowerCase()) &&
      other.descricao.toLowerCase().includes(filters.descricao.toLowerCase()) &&
      (filters.data === "" ||
        formatDate(other.data).includes(filters.data.toLowerCase())) &&
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
            <th className="border-t border-x p-2">Tipo</th>
            <th className="border-t border-x p-2">Descrição</th>
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
              <input
                type="text"
                value={filters.tipo}
                onChange={(e) => handleFilterChange("tipo", e.target.value)}
                className="w-full p-1 border rounded font-normal"
                placeholder="Filtrar"
              />
            </th>
            <th className="border-x p-1">
              <input
                type="text"
                value={filters.descricao}
                onChange={(e) =>
                  handleFilterChange("descricao", e.target.value)
                }
                className="w-full p-1 border rounded font-normal"
                placeholder="Filtrar"
              />
            </th>
            <th className="border-x p-1">
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  value={filters.data}
                  onChange={(e) => handleFilterChange("data", e.target.value)}
                  className="w-full p-1 border rounded font-normal"
                  placeholder="Filtrar texto"
                />
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
          {filteredActivities?.map((other, index) => (
            <tr key={index} className="text-center border">
              <td className="border p-2">{other.distrito}</td>
              <td className="border p-2">{other.tipo}</td>
              <td className="border p-2">{other.descricao}</td>
              <td className="border p-2">{formatDate(other.data)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
