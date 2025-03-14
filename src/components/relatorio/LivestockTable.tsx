import { useState } from "react";
import { useProductiveActivities } from "../../hooks/useActiviteProductivies";
import { LivestockProps } from "../../services/productive-activities/productiveActivitiesApi";
import { activityAcess } from "../../utils/constants";

import styles from "./styles.module.scss";

export default function LivestockTable() {
  const { data: activities, isLoading } = useProductiveActivities(
    activityAcess.livestock
  );

  const [filters, setFilters] = useState({
    distrito: "",
    especie: "",
    quantidade: "",
    aptidao_corte: "",
    aptidao_leite: "",
    aptidao_postura: "",
    raca_predominante: "",
    valor_comercializacao: "",
    destinacao_venda: "",
    destinacao_casa: "",
  });

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredActivities = activities?.filter((activity) => {
    const live = activity as LivestockProps;
    return (
      live.distrito.toLowerCase().includes(filters.distrito.toLowerCase()) &&
      live.especie.toLowerCase().includes(filters.especie.toLowerCase()) &&
      (filters.quantidade === "" ||
        live.quantidade.toString().includes(filters.quantidade)) &&
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
      (filters.valor_comercializacao === "" ||
        live.valor_comercializacao
          .toString()
          .includes(filters.valor_comercializacao)) &&
      (filters.destinacao_venda === "" ||
        live.destinacao_venda.toString().includes(filters.destinacao_venda)) &&
      (filters.destinacao_casa === "" ||
        live.destinacao_casa.toString().includes(filters.destinacao_casa))
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
                  value={filters.destinacao_venda}
                  onChange={(e) =>
                    handleFilterChange("destinacao_venda", e.target.value)
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
            </tr>
          </thead>
          <tbody>
            {filteredActivities?.map((activity, index) => {
              const live = activity as LivestockProps;
              return (
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
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
}
