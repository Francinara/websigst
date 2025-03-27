import { useState, useRef, useEffect, Dispatch, SetStateAction } from "react";
import { useDebounce } from "use-debounce";
import { useProductiveActivities } from "../../hooks/useActiviteProductivies";
import { LivestockProps } from "../../services/productive-activities/productiveActivitiesApi";
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

export default function LivestockTable({
  setIsLoading,
}: {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}) {
  const [filters, setFilters] = useState({
    distrito: "",
    especie: "",
    quantidade_min: "",
    quantidade_max: "",
    aptidao_corte: "",
    aptidao_leite: "",
    aptidao_postura: "",
    raca_predominante: "",
    valor_comercializacao_min: "",
    valor_comercializacao_max: "",
    destinacao_venda_min: "",
    destinacao_venda_max: "",
    destinacao_casa_min: "",
    destinacao_casa_max: "",
    data: "",
    data_inicio: "",
    data_fim: "",
  });

  const visitsRef = useRef<LivestockProps[]>([]);
  const [displayedVisits, setDisplayedVisits] = useState<LivestockProps[]>([]);

  const convertedFilters = {
    ...filters,
    quantidade_min: filters.quantidade_min
      ? Number(filters.quantidade_min)
      : undefined,
    quantidade_max: filters.quantidade_max
      ? Number(filters.quantidade_max)
      : undefined,
    aptidao_corte:
      filters.aptidao_corte === "Sim"
        ? true
        : filters.aptidao_corte === "Não"
        ? false
        : undefined,
    aptidao_leite:
      filters.aptidao_leite === "Sim"
        ? true
        : filters.aptidao_leite === "Não"
        ? false
        : undefined,
    aptidao_postura:
      filters.aptidao_postura === "Sim"
        ? true
        : filters.aptidao_postura === "Não"
        ? false
        : undefined,
    valor_comercializacao_min: filters.valor_comercializacao_min
      ? Number(filters.valor_comercializacao_min)
      : undefined,
    valor_comercializacao_max: filters.valor_comercializacao_max
      ? Number(filters.valor_comercializacao_max)
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
    activityAcess.livestock,
    debouncedFilters
  );

  useEffect(() => {
    if (activities) {
      visitsRef.current = activities as LivestockProps[];
      setDisplayedVisits(activities as LivestockProps[]);
    }
  }, [activities]);

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading, setIsLoading]);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredActivities = displayedVisits.filter((live) => {
    const visitDate = new Date(live.data ?? "");
    const dataInicio = filters.data_inicio
      ? new Date(filters.data_inicio)
      : null;
    const dataFim = filters.data_fim ? new Date(filters.data_fim) : null;

    return (
      live.distrito.toLowerCase().includes(filters.distrito.toLowerCase()) &&
      live.especie.toLowerCase().includes(filters.especie.toLowerCase()) &&
      (filters.quantidade_min === "" ||
        live.quantidade >= Number(filters.quantidade_min)) &&
      (filters.quantidade_max === "" ||
        live.quantidade <= Number(filters.quantidade_max)) &&
      (filters.aptidao_corte === "" ||
        (live.aptidao_corte ? "Sim" : "Não")
          .toLowerCase()
          .includes(filters.aptidao_corte.toLowerCase())) &&
      (filters.aptidao_leite === "" ||
        (live.aptidao_leite ? "Sim" : "Não")
          .toLowerCase()
          .includes(filters.aptidao_leite.toLowerCase())) &&
      (filters.aptidao_postura === "" ||
        (live.aptidao_postura ? "Sim" : "Não")
          .toLowerCase()
          .includes(filters.aptidao_postura.toLowerCase())) &&
      live.raca_predominante
        .toLowerCase()
        .includes(filters.raca_predominante.toLowerCase()) &&
      (filters.valor_comercializacao_min === "" ||
        live.valor_comercializacao >=
          Number(filters.valor_comercializacao_min)) &&
      (filters.valor_comercializacao_max === "" ||
        live.valor_comercializacao <=
          Number(filters.valor_comercializacao_max)) &&
      (filters.destinacao_venda_min === "" ||
        live.destinacao_venda >= Number(filters.destinacao_venda_min)) &&
      (filters.destinacao_venda_max === "" ||
        live.destinacao_venda <= Number(filters.destinacao_venda_max)) &&
      (filters.destinacao_casa_min === "" ||
        live.destinacao_casa >= Number(filters.destinacao_casa_min)) &&
      (filters.destinacao_casa_max === "" ||
        live.destinacao_casa <= Number(filters.destinacao_casa_max)) &&
      (filters.data === "" ||
        formatDate(live.data).includes(filters.data.toLowerCase())) &&
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
            <th className="border-t border-x p-2">Espécie</th>
            <th className="border-t border-x p-2">Quantidade</th>
            <th className="border-t border-x p-2">Aptidão Corte</th>
            <th className="border-t border-x p-2">Aptidão Leite</th>
            <th className="border-t border-x p-2">Aptidão Postura</th>
            <th className="border-t border-x p-2">Raça Predominante</th>
            <th className="border-t border-x p-2">
              Valor Comercialização (R$)
            </th>
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
                value={filters.especie}
                onChange={(e) => handleFilterChange("especie", e.target.value)}
                className="w-full p-1 border rounded font-normal"
                placeholder="Filtrar"
              />
            </th>
            <th className="border-x p-1">
              <div className="flex flex-col gap-1">
                <input
                  type="number"
                  value={filters.quantidade_min}
                  onChange={(e) =>
                    handleFilterChange("quantidade_min", e.target.value)
                  }
                  className="w-full p-1 border rounded font-normal"
                  placeholder="Mínimo"
                />
                <input
                  type="number"
                  value={filters.quantidade_max}
                  onChange={(e) =>
                    handleFilterChange("quantidade_max", e.target.value)
                  }
                  className="w-full p-1 border rounded font-normal"
                  placeholder="Máximo"
                />
              </div>
            </th>
            <th className="border-x p-1">
              <select
                value={filters.aptidao_corte}
                onChange={(e) =>
                  handleFilterChange("aptidao_corte", e.target.value)
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
                value={filters.aptidao_leite}
                onChange={(e) =>
                  handleFilterChange("aptidao_leite", e.target.value)
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
                value={filters.aptidao_postura}
                onChange={(e) =>
                  handleFilterChange("aptidao_postura", e.target.value)
                }
                className="w-full p-1 border rounded font-normal"
              >
                <option value="">Todos</option>
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </select>
            </th>
            <th className="border-x p-1">
              <input
                type="text"
                value={filters.raca_predominante}
                onChange={(e) =>
                  handleFilterChange("raca_predominante", e.target.value)
                }
                className="w-full p-1 border rounded font-normal"
                placeholder="Filtrar"
              />
            </th>
            <th className="border-x p-1">
              <div className="flex flex-col gap-1">
                <input
                  type="number"
                  value={filters.valor_comercializacao_min}
                  onChange={(e) =>
                    handleFilterChange(
                      "valor_comercializacao_min",
                      e.target.value
                    )
                  }
                  className="w-full p-1 border rounded font-normal"
                  placeholder="Mínimo"
                />
                <input
                  type="number"
                  value={filters.valor_comercializacao_max}
                  onChange={(e) =>
                    handleFilterChange(
                      "valor_comercializacao_max",
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
          {filteredActivities?.map((live, index) => (
            <tr key={index} className="text-center border">
              <td className="border p-2">{live.distrito}</td>
              <td className="border p-2">{live.especie}</td>
              <td className="border p-2">{live.quantidade}</td>
              <td className="border p-2">
                {live.aptidao_corte ? "Sim" : "Não"}
              </td>
              <td className="border p-2">
                {live.aptidao_leite ? "Sim" : "Não"}
              </td>
              <td className="border p-2">
                {live.aptidao_postura ? "Sim" : "Não"}
              </td>
              <td className="border p-2">{live.raca_predominante}</td>
              <td className="border p-2">
                {live.valor_comercializacao.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td className="border p-2">{live.destinacao_venda}</td>
              <td className="border p-2">{live.destinacao_casa}</td>
              <td className="border p-2">{formatDate(live.data)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
