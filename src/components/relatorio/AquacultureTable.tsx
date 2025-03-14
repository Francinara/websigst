import { useState } from "react";
import { useProductiveActivities } from "../../hooks/useActiviteProductivies";
import { AquacultureProps } from "../../services/productive-activities/productiveActivitiesApi";
import { activityAcess } from "../../utils/constants";

import styles from "./styles.module.scss";

export default function AquacultureTable() {
  const { data: activities, isLoading } = useProductiveActivities(
    activityAcess.aquaculture
  );

  const [filters, setFilters] = useState({
    distrito: "",
    cultura: "",
    especie: "",
    quantidade: "",
    lamina_agua: "",
    aptidao_corte: "",
    aptidao_reproducao: "",
    valor_comercializacao: "",
    destinacao_casa: "",
    destinacao_verda: "",
  });

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredActivities = activities?.filter((activity) => {
    const aqua = activity as AquacultureProps;
    return (
      aqua.distrito.toLowerCase().includes(filters.distrito.toLowerCase()) &&
      aqua.cultura.toLowerCase().includes(filters.cultura.toLowerCase()) &&
      aqua.especie.toLowerCase().includes(filters.especie.toLowerCase()) &&
      (filters.quantidade === "" ||
        aqua.quantidade.toString().includes(filters.quantidade)) &&
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
      (filters.valor_comercializacao === "" ||
        aqua.valor_comercializacao
          .toString()
          .includes(filters.valor_comercializacao)) &&
      (filters.destinacao_casa === "" ||
        aqua.destinacao_casa.toString().includes(filters.destinacao_casa)) &&
      (filters.destinacao_verda === "" ||
        aqua.destinacao_verda.toString().includes(filters.destinacao_verda))
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
            </tr>
            <tr className="bg-stone-100">
              <th className="border-x p-1">
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
              <th className="border-x p-1">
                <input
                  type="text"
                  value={filters.cultura}
                  onChange={(e) =>
                    handleFilterChange("cultura", e.target.value)
                  }
                  className="w-full p-1 border rounded font-normal"
                  placeholder="Filtrar"
                />
              </th>
              <th className="border-x p-1">
                <input
                  type="text"
                  value={filters.especie}
                  onChange={(e) =>
                    handleFilterChange("especie", e.target.value)
                  }
                  className="w-full p-1 border rounded font-normal"
                  placeholder="Filtrar"
                />
              </th>
              <th className="border-x p-1">
                <input
                  type="text"
                  value={filters.quantidade}
                  onChange={(e) =>
                    handleFilterChange("quantidade", e.target.value)
                  }
                  className="w-full p-1 border rounded font-normal"
                  placeholder="Filtrar"
                />
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
                <input
                  type="text"
                  value={filters.valor_comercializacao}
                  onChange={(e) =>
                    handleFilterChange("valor_comercializacao", e.target.value)
                  }
                  className="w-full p-1 border rounded font-normal"
                  placeholder="Filtrar"
                />
              </th>
              <th className="border-x p-1">
                <input
                  type="text"
                  value={filters.destinacao_casa}
                  onChange={(e) =>
                    handleFilterChange("destinacao_casa", e.target.value)
                  }
                  className="w-full p-1 border rounded font-normal"
                  placeholder="Filtrar"
                />
              </th>
              <th className="border-x p-1">
                <input
                  type="text"
                  value={filters.destinacao_verda}
                  onChange={(e) =>
                    handleFilterChange("destinacao_verda", e.target.value)
                  }
                  className="w-full p-1 border rounded font-normal"
                  placeholder="Filtrar"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredActivities?.map((activity, index) => {
              const aqua = activity as AquacultureProps;
              return (
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
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
}
