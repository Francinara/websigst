import { useState, useRef, useEffect, Dispatch, SetStateAction } from "react";
import { useDebounce } from "use-debounce";
import { useProductiveActivities } from "../../hooks/useActiviteProductivies";
import { CraftsmanshipProps } from "../../services/productive-activities/productiveActivitiesApi";
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

export default function CraftsmanshipTable({
  setIsLoading,
}: {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}) {
  const [filters, setFilters] = useState({
    distrito: "",
    produto: "",
    destinacao_valor: "",
    data: "",
    data_inicio: "",
    data_fim: "",
  });

  const visitsRef = useRef<CraftsmanshipProps[]>([]);
  const [displayedVisits, setDisplayedVisits] = useState<CraftsmanshipProps[]>(
    []
  );

  const convertedFilters = { ...filters };

  const [debouncedFilters] = useDebounce(convertedFilters, 500);
  const { data: activities, isLoading } = useProductiveActivities(
    activityAcess.craftsmanship,
    debouncedFilters
  );

  useEffect(() => {
    if (activities) {
      visitsRef.current = activities as CraftsmanshipProps[];
      setDisplayedVisits(activities as CraftsmanshipProps[]);
    }
  }, [activities]);

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading, setIsLoading]);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredActivities = displayedVisits.filter((craft) => {
    const visitDate = new Date(craft.data ?? "");
    const dataInicio = filters.data_inicio
      ? new Date(filters.data_inicio)
      : null;
    const dataFim = filters.data_fim ? new Date(filters.data_fim) : null;

    return (
      craft.distrito.toLowerCase().includes(filters.distrito.toLowerCase()) &&
      craft.produto.toLowerCase().includes(filters.produto.toLowerCase()) &&
      craft.destinacao_valor
        .toLowerCase()
        .includes(filters.destinacao_valor.toLowerCase()) &&
      (filters.data === "" ||
        formatDate(craft.data).includes(filters.data.toLowerCase())) &&
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
            <th className="border-t border-x p-2">Produto</th>
            <th className="border-t border-x p-2">Destinação Valor</th>
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
                value={filters.produto}
                onChange={(e) => handleFilterChange("produto", e.target.value)}
                className="w-full p-1 border rounded font-normal"
                placeholder="Filtrar"
              />
            </th>
            <th className="border-x p-1">
              <input
                type="text"
                value={filters.destinacao_valor}
                onChange={(e) =>
                  handleFilterChange("destinacao_valor", e.target.value)
                }
                className="w-full p-1 border rounded font-normal"
                placeholder="Filtrar"
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
          {filteredActivities?.map((craft, index) => (
            <tr key={index} className="text-center border">
              <td className="border p-2">{craft.distrito}</td>
              <td className="border p-2">{craft.produto}</td>
              <td className="border p-2">{craft.destinacao_valor}</td>
              <td className="border p-2">{formatDate(craft.data)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
