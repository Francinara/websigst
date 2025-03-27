import { useState, useRef, useEffect, Dispatch, SetStateAction } from "react";
import { useDebounce } from "use-debounce";
import { useProductiveActivities } from "../../hooks/useActiviteProductivies";
import { AquacultureProps } from "../../services/productive-activities/productiveActivitiesApi";
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

export default function AquacultureTable({
  setIsLoading,
}: {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}) {
  const [filters, setFilters] = useState({
    distrito: "",
    cultura: "",
    especie: "",
    quantidade_min: "",
    quantidade_max: "",
    lamina_agua: "",
    aptidao_corte: "",
    aptidao_reproducao: "",
    valor_comercializacao_min: "",
    valor_comercializacao_max: "",
    destinacao_casa_min: "",
    destinacao_casa_max: "",
    destinacao_verda_min: "",
    destinacao_verda_max: "",
    data: "",
    data_inicio: "",
    data_fim: "",
  });

  const visitsRef = useRef<AquacultureProps[]>([]);
  const [displayedVisits, setDisplayedVisits] = useState<AquacultureProps[]>(
    []
  );

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
    aptidao_reproducao:
      filters.aptidao_reproducao === "Sim"
        ? true
        : filters.aptidao_reproducao === "Não"
        ? false
        : undefined,
    valor_comercializacao_min: filters.valor_comercializacao_min
      ? Number(filters.valor_comercializacao_min)
      : undefined,
    valor_comercializacao_max: filters.valor_comercializacao_max
      ? Number(filters.valor_comercializacao_max)
      : undefined,
    destinacao_casa_min: filters.destinacao_casa_min
      ? Number(filters.destinacao_casa_min)
      : undefined,
    destinacao_casa_max: filters.destinacao_casa_max
      ? Number(filters.destinacao_casa_max)
      : undefined,
    destinacao_verda_min: filters.destinacao_verda_min
      ? Number(filters.destinacao_verda_min)
      : undefined,
    destinacao_verda_max: filters.destinacao_verda_max
      ? Number(filters.destinacao_verda_max)
      : undefined,
  };

  const [debouncedFilters] = useDebounce(convertedFilters, 500);
  const { data: activities, isLoading } = useProductiveActivities(
    activityAcess.aquaculture,
    debouncedFilters
  );

  useEffect(() => {
    if (activities) {
      visitsRef.current = activities as AquacultureProps[];
      setDisplayedVisits(activities as AquacultureProps[]);
    }
  }, [activities]);

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading, setIsLoading]);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredActivities = displayedVisits.filter((aqua) => {
    const visitDate = new Date(aqua.data ?? "");
    const dataInicio = filters.data_inicio
      ? new Date(filters.data_inicio)
      : null;
    const dataFim = filters.data_fim ? new Date(filters.data_fim) : null;

    return (
      aqua.distrito.toLowerCase().includes(filters.distrito.toLowerCase()) &&
      aqua.cultura.toLowerCase().includes(filters.cultura.toLowerCase()) &&
      aqua.especie.toLowerCase().includes(filters.especie.toLowerCase()) &&
      (filters.quantidade_min === "" ||
        aqua.quantidade >= Number(filters.quantidade_min)) &&
      (filters.quantidade_max === "" ||
        aqua.quantidade <= Number(filters.quantidade_max)) &&
      aqua.lamina_agua
        .toLowerCase()
        .includes(filters.lamina_agua.toLowerCase()) &&
      (filters.aptidao_corte === "" ||
        (aqua.aptidao_corte ? "Sim" : "Não")
          .toLowerCase()
          .includes(filters.aptidao_corte.toLowerCase())) &&
      (filters.aptidao_reproducao === "" ||
        (aqua.aptidao_reproducao ? "Sim" : "Não")
          .toLowerCase()
          .includes(filters.aptidao_reproducao.toLowerCase())) &&
      (filters.valor_comercializacao_min === "" ||
        aqua.valor_comercializacao >=
          Number(filters.valor_comercializacao_min)) &&
      (filters.valor_comercializacao_max === "" ||
        aqua.valor_comercializacao <=
          Number(filters.valor_comercializacao_max)) &&
      (filters.destinacao_casa_min === "" ||
        aqua.destinacao_casa >= Number(filters.destinacao_casa_min)) &&
      (filters.destinacao_casa_max === "" ||
        aqua.destinacao_casa <= Number(filters.destinacao_casa_max)) &&
      (filters.destinacao_verda_min === "" ||
        aqua.destinacao_verda >= Number(filters.destinacao_verda_min)) &&
      (filters.destinacao_verda_max === "" ||
        aqua.destinacao_verda <= Number(filters.destinacao_verda_max)) &&
      (filters.data === "" ||
        formatDate(aqua.data).includes(filters.data.toLowerCase())) &&
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
            <th className="border-t border-x p-2">Espécie</th>
            <th className="border-t border-x p-2">Quantidade</th>
            <th className="border-t border-x p-2">Lâmina d'Água</th>
            <th className="border-t border-x p-2">Aptidão Corte</th>
            <th className="border-t border-x p-2">Aptidão Reprodução</th>
            <th className="border-t border-x p-2">
              Valor Comercialização (R$)
            </th>
            <th className="border-t border-x p-2">Destinação Casa (%)</th>
            <th className="border-t border-x p-2">Destinação Venda (%)</th>
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
              <input
                type="text"
                value={filters.lamina_agua}
                onChange={(e) =>
                  handleFilterChange("lamina_agua", e.target.value)
                }
                className="w-full p-1 border rounded font-normal"
                placeholder="Filtrar"
              />
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
                value={filters.aptidao_reproducao}
                onChange={(e) =>
                  handleFilterChange("aptidao_reproducao", e.target.value)
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
                  type="number"
                  value={filters.destinacao_verda_min}
                  onChange={(e) =>
                    handleFilterChange("destinacao_verda_min", e.target.value)
                  }
                  className="w-full p-1 border rounded font-normal"
                  placeholder="Mínimo"
                />
                <input
                  type="number"
                  value={filters.destinacao_verda_max}
                  onChange={(e) =>
                    handleFilterChange("destinacao_verda_max", e.target.value)
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
          {filteredActivities?.map((aqua, index) => (
            <tr key={index} className="text-center border">
              <td className="border p-2">{aqua.distrito}</td>
              <td className="border p-2">{aqua.cultura}</td>
              <td className="border p-2">{aqua.especie}</td>
              <td className="border p-2">{aqua.quantidade}</td>
              <td className="border p-2">{aqua.lamina_agua}</td>
              <td className="border p-2">
                {aqua.aptidao_corte ? "Sim" : "Não"}
              </td>
              <td className="border p-2">
                {aqua.aptidao_reproducao ? "Sim" : "Não"}
              </td>
              <td className="border p-2">
                {aqua.valor_comercializacao.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td className="border p-2">{aqua.destinacao_casa}</td>
              <td className="border p-2">{aqua.destinacao_verda}</td>
              <td className="border p-2">{formatDate(aqua.data)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
