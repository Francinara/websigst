import { useState, useRef, useEffect, Dispatch, SetStateAction } from "react";
import { useDebounce } from "use-debounce";
import { useProductiveActivities } from "../../hooks/useActiviteProductivies";
import { AgricultureProps } from "../../services/productive-activities/productiveActivitiesApi";
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

export default function AgricultureTable({
  setIsLoading,
}: {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}) {
  const [filters, setFilters] = useState({
    distrito: "",
    cultura: "",
    data_plantio: "",
    data_plantio_inicio: "",
    data_plantio_fim: "",
    data_colheita: "",
    data_colheita_inicio: "",
    data_colheita_fim: "",
    producao_ano_min: "",
    producao_ano_max: "",
    area_cultivo_min: "",
    area_cultivo_max: "",
    irrigacao: "",
    valor_comercializado_min: "",
    valor_comercializado_max: "",
    destinacao_venda_min: "",
    destinacao_venda_max: "",
    destinacao_casa_min: "",
    destinacao_casa_max: "",
    data: "",
    data_inicio: "",
    data_fim: "",
  });

  const visitsRef = useRef<AgricultureProps[]>([]);
  const [displayedVisits, setDisplayedVisits] = useState<AgricultureProps[]>(
    []
  );

  const convertedFilters = {
    ...filters,
    producao_ano_min: filters.producao_ano_min
      ? Number(filters.producao_ano_min)
      : undefined,
    producao_ano_max: filters.producao_ano_max
      ? Number(filters.producao_ano_max)
      : undefined,
    area_cultivo_min: filters.area_cultivo_min
      ? Number(filters.area_cultivo_min)
      : undefined,
    area_cultivo_max: filters.area_cultivo_max
      ? Number(filters.area_cultivo_max)
      : undefined,
    irrigacao:
      filters.irrigacao === "Sim"
        ? true
        : filters.irrigacao === "Não"
        ? false
        : undefined,
    valor_comercializado_min: filters.valor_comercializado_min
      ? Number(filters.valor_comercializado_min)
      : undefined,
    valor_comercializado_max: filters.valor_comercializado_max
      ? Number(filters.valor_comercializado_max)
      : undefined,
    destinacao_venda_min: filters.destinacao_venda_min
      ? Number(filters.destinacao_venda_min)
      : undefined,
    destinacao_venda_max: filters.destinacao_venda_max
      ? Number(filters.destinacao_venda_max)
      : undefined,
    destinacao_casa_min: filters.destinacao_casa_min
      ? Number(filters.destinacao_casa_min)
      : undefined,
    destinacao_casa_max: filters.destinacao_casa_max
      ? Number(filters.destinacao_casa_max)
      : undefined,
  };

  const [debouncedFilters] = useDebounce(convertedFilters, 500);
  const { data: activities, isLoading } = useProductiveActivities(
    activityAcess.agriculture,
    debouncedFilters
  );

  useEffect(() => {
    if (activities) {
      visitsRef.current = activities as AgricultureProps[];
      setDisplayedVisits(activities as AgricultureProps[]);
    }
  }, [activities]);

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading, setIsLoading]);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredActivities = displayedVisits.filter((agri) => {
    const plantioDate = new Date(agri.data_plantio ?? "");
    const colheitaDate = new Date(agri.data_colheita ?? "");
    const visitDate = new Date(agri.data ?? "");
    const plantioInicio = filters.data_plantio_inicio
      ? new Date(filters.data_plantio_inicio)
      : null;
    const plantioFim = filters.data_plantio_fim
      ? new Date(filters.data_plantio_fim)
      : null;
    const colheitaInicio = filters.data_colheita_inicio
      ? new Date(filters.data_colheita_inicio)
      : null;
    const colheitaFim = filters.data_colheita_fim
      ? new Date(filters.data_colheita_fim)
      : null;
    const dataInicio = filters.data_inicio
      ? new Date(filters.data_inicio)
      : null;
    const dataFim = filters.data_fim ? new Date(filters.data_fim) : null;

    return (
      agri.distrito.toLowerCase().includes(filters.distrito.toLowerCase()) &&
      agri.cultura.toLowerCase().includes(filters.cultura.toLowerCase()) &&
      (filters.data_plantio === "" ||
        formatDate(agri.data_plantio).includes(
          filters.data_plantio.toLowerCase()
        )) &&
      (!plantioInicio || plantioDate >= plantioInicio) &&
      (!plantioFim || plantioDate <= plantioFim) &&
      (filters.data_colheita === "" ||
        formatDate(agri.data_colheita).includes(
          filters.data_colheita.toLowerCase()
        )) &&
      (!colheitaInicio || colheitaDate >= colheitaInicio) &&
      (!colheitaFim || colheitaDate <= colheitaFim) &&
      (filters.producao_ano_min === "" ||
        agri.producao_ano >= Number(filters.producao_ano_min)) &&
      (filters.producao_ano_max === "" ||
        agri.producao_ano <= Number(filters.producao_ano_max)) &&
      (filters.area_cultivo_min === "" ||
        agri.area_cultivo >= Number(filters.area_cultivo_min)) &&
      (filters.area_cultivo_max === "" ||
        agri.area_cultivo <= Number(filters.area_cultivo_max)) &&
      (filters.irrigacao === "" ||
        (agri.irrigacao ? "Sim" : "Não")
          .toLowerCase()
          .includes(filters.irrigacao.toLowerCase())) &&
      (filters.valor_comercializado_min === "" ||
        agri.valor_comercializado >=
          Number(filters.valor_comercializado_min)) &&
      (filters.valor_comercializado_max === "" ||
        agri.valor_comercializado <=
          Number(filters.valor_comercializado_max)) &&
      (filters.destinacao_venda_min === "" ||
        agri.destinacao_venda >= Number(filters.destinacao_venda_min)) &&
      (filters.destinacao_venda_max === "" ||
        agri.destinacao_venda <= Number(filters.destinacao_venda_max)) &&
      (filters.destinacao_casa_min === "" ||
        agri.destinacao_casa >= Number(filters.destinacao_casa_min)) &&
      (filters.destinacao_casa_max === "" ||
        agri.destinacao_casa <= Number(filters.destinacao_casa_max)) &&
      (filters.data === "" ||
        formatDate(agri.data).includes(filters.data.toLowerCase())) &&
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
            <th className="border-t border-x p-2">Cultura</th>
            <th className="border-t border-x p-2">Data de Plantio</th>
            <th className="border-t border-x p-2">Data de Colheita</th>
            <th className="border-t border-x p-2">Produção (ton)</th>
            <th className="border-t border-x p-2">Área Cultivada (ha)</th>
            <th className="border-t border-x p-2">Irrigação</th>
            <th className="border-t border-x p-2">Valor Comercializado (R$)</th>
            <th className="border-t border-x p-2">Destinação Venda (%)</th>
            <th className="border-t border-x p-2">Destinação Casa (%)</th>
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
                value={filters.cultura}
                onChange={(e) => handleFilterChange("cultura", e.target.value)}
                className="w-full p-1 border rounded font-normal"
                placeholder="Filtrar"
              />
            </th>
            <th className="border-x p-1">
              <div className="flex flex-col gap-1">
                <input
                  type="date"
                  value={filters.data_plantio_inicio}
                  onChange={(e) =>
                    handleFilterChange("data_plantio_inicio", e.target.value)
                  }
                  className="w-full p-1 border rounded font-normal"
                />
                <input
                  type="date"
                  value={filters.data_plantio_fim}
                  onChange={(e) =>
                    handleFilterChange("data_plantio_fim", e.target.value)
                  }
                  className="w-full p-1 border rounded font-normal"
                />
              </div>
            </th>
            <th className="border-x p-1">
              <div className="flex flex-col gap-1">
                <input
                  type="date"
                  value={filters.data_colheita_inicio}
                  onChange={(e) =>
                    handleFilterChange("data_colheita_inicio", e.target.value)
                  }
                  className="w-full p-1 border rounded font-normal"
                />
                <input
                  type="date"
                  value={filters.data_colheita_fim}
                  onChange={(e) =>
                    handleFilterChange("data_colheita_fim", e.target.value)
                  }
                  className="w-full p-1 border rounded font-normal"
                />
              </div>
            </th>
            <th className="border-x p-1">
              <div className="flex flex-col gap-1">
                <input
                  type="number"
                  value={filters.producao_ano_min}
                  onChange={(e) =>
                    handleFilterChange("producao_ano_min", e.target.value)
                  }
                  className="w-full p-1 border rounded font-normal"
                  placeholder="Mínimo"
                />
                <input
                  type="number"
                  value={filters.producao_ano_max}
                  onChange={(e) =>
                    handleFilterChange("producao_ano_max", e.target.value)
                  }
                  className="w-full p-1 border rounded font-normal"
                  placeholder="Máximo"
                />
              </div>
            </th>
            <th className="border-x p-1">
              <div className="flex flex-col gap-1">
                <input
                  type="number"
                  value={filters.area_cultivo_min}
                  onChange={(e) =>
                    handleFilterChange("area_cultivo_min", e.target.value)
                  }
                  className="w-full p-1 border rounded font-normal"
                  placeholder="Mínimo"
                />
                <input
                  type="number"
                  value={filters.area_cultivo_max}
                  onChange={(e) =>
                    handleFilterChange("area_cultivo_max", e.target.value)
                  }
                  className="w-full p-1 border rounded font-normal"
                  placeholder="Máximo"
                />
              </div>
            </th>
            <th className="border-x p-1">
              <select
                value={filters.irrigacao}
                onChange={(e) =>
                  handleFilterChange("irrigacao", e.target.value)
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
                  type="number"
                  value={filters.valor_comercializado_min}
                  onChange={(e) =>
                    handleFilterChange(
                      "valor_comercializado_min",
                      e.target.value
                    )
                  }
                  className="w-full p-1 border rounded font-normal"
                  placeholder="Mínimo"
                />
                <input
                  type="number"
                  value={filters.valor_comercializado_max}
                  onChange={(e) =>
                    handleFilterChange(
                      "valor_comercializado_max",
                      e.target.value
                    )
                  }
                  className="w-full p-1 border rounded font-normal"
                  placeholder="Máximo"
                />
              </div>
            </th>
            <th className="border-x p-1">
              <div className="flex flex-col gap-1">
                <input
                  type="number"
                  value={filters.destinacao_venda_min}
                  onChange={(e) =>
                    handleFilterChange("destinacao_venda_min", e.target.value)
                  }
                  className="w-full p-1 border rounded font-normal"
                  placeholder="Mínimo"
                />
                <input
                  type="number"
                  value={filters.destinacao_venda_max}
                  onChange={(e) =>
                    handleFilterChange("destinacao_venda_max", e.target.value)
                  }
                  className="w-full p-1 border rounded font-normal"
                  placeholder="Máximo"
                />
              </div>
            </th>
            <th className="border-x p-1">
              <div className="flex flex-col gap-1">
                <input
                  type="number"
                  value={filters.destinacao_casa_min}
                  onChange={(e) =>
                    handleFilterChange("destinacao_casa_min", e.target.value)
                  }
                  className="w-full p-1 border rounded font-normal"
                  placeholder="Mínimo"
                />
                <input
                  type="number"
                  value={filters.destinacao_casa_max}
                  onChange={(e) =>
                    handleFilterChange("destinacao_casa_max", e.target.value)
                  }
                  className="w-full p-1 border rounded font-normal"
                  placeholder="Máximo"
                />
              </div>
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
          {filteredActivities?.map((agri, index) => (
            <tr key={index} className="text-center border">
              <td className="border p-2">{agri.distrito}</td>
              <td className="border p-2">{agri.cultura}</td>
              <td className="border p-2">{formatDate(agri.data_plantio)}</td>
              <td className="border p-2">{formatDate(agri.data_colheita)}</td>
              <td className="border p-2">{agri.producao_ano}</td>
              <td className="border p-2">{agri.area_cultivo}</td>
              <td className="border p-2">{agri.irrigacao ? "Sim" : "Não"}</td>
              <td className="border p-2">
                {agri.valor_comercializado.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td className="border p-2">{agri.destinacao_venda}</td>
              <td className="border p-2">{agri.destinacao_casa}</td>
              <td className="border p-2">{formatDate(agri.data)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
