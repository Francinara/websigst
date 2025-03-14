import { useState } from "react";
import { useProductiveActivities } from "../../hooks/useActiviteProductivies";
import { AgricultureProps } from "../../services/productive-activities/productiveActivitiesApi";
import { activityAcess } from "../../utils/constants";
import styles from "./styles.module.scss";

export default function AgricultureTable() {
  const { data: activities, isLoading } = useProductiveActivities(
    activityAcess.agriculture
  );

  const [filters, setFilters] = useState({
    distrito: "",
    cultura: "",
    data_plantio: "",
    data_colheita: "",
    producao_ano: "",
    area_cultivo: "",
    irrigacao: "",
    valor_comercializado: "",
    destinacao_venda: "",
    destinacao_casa: "",
  });

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredActivities = activities?.filter((agriculture) => {
    const agri = agriculture as AgricultureProps;
    return (
      agri.distrito.toLowerCase().includes(filters.distrito.toLowerCase()) &&
      agri.cultura.toLowerCase().includes(filters.cultura.toLowerCase()) &&
      agri.data_plantio
        .toLowerCase()
        .includes(filters.data_plantio.toLowerCase()) &&
      agri.data_colheita
        .toLowerCase()
        .includes(filters.data_colheita.toLowerCase()) &&
      (filters.producao_ano === "" ||
        agri.producao_ano.toString().includes(filters.producao_ano)) &&
      (filters.area_cultivo === "" ||
        agri.area_cultivo.toString().includes(filters.area_cultivo)) &&
      (filters.irrigacao === "" ||
        (agri.irrigacao ? "Sim" : "Não")
          .toLowerCase()
          .includes(filters.irrigacao.toLowerCase())) &&
      (filters.valor_comercializado === "" ||
        agri.valor_comercializado
          .toString()
          .includes(filters.valor_comercializado)) &&
      (filters.destinacao_venda === "" ||
        agri.destinacao_venda.toString().includes(filters.destinacao_venda)) &&
      (filters.destinacao_casa === "" ||
        agri.destinacao_casa.toString().includes(filters.destinacao_casa))
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
              <th className="border-t border-x p-2">Data de Plantio</th>
              <th className="border-t border-x p-2">Data de Colheita</th>
              <th className="border-t border-x p-2">Produção (ton)</th>
              <th className="border-t border-x p-2">Área Cultivada (ha)</th>
              <th className="border-t border-x p-2">Irrigação</th>
              <th className="border-t border-x p-2">
                Valor Comercializado (R$)
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
                  value={filters.data_plantio}
                  onChange={(e) =>
                    handleFilterChange("data_plantio", e.target.value)
                  }
                  className="w-full p-1 border rounded font-normal"
                  placeholder="Filtrar"
                />
              </th>
              <th className="border-x p-1">
                <input
                  type="text"
                  value={filters.data_colheita}
                  onChange={(e) =>
                    handleFilterChange("data_colheita", e.target.value)
                  }
                  className="w-full p-1 border rounded font-normal"
                  placeholder="Filtrar"
                />
              </th>
              <th className="border-x p-1">
                <input
                  type="text"
                  value={filters.producao_ano}
                  onChange={(e) =>
                    handleFilterChange("producao_ano", e.target.value)
                  }
                  className="w-full p-1 border rounded font-normal"
                  placeholder="Filtrar"
                />
              </th>
              <th className="border-x p-1">
                <input
                  type="text"
                  value={filters.area_cultivo}
                  onChange={(e) =>
                    handleFilterChange("area_cultivo", e.target.value)
                  }
                  className="w-full p-1 border rounded font-normal"
                  placeholder="Filtrar"
                />
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
                <input
                  type="text"
                  value={filters.valor_comercializado}
                  onChange={(e) =>
                    handleFilterChange("valor_comercializado", e.target.value)
                  }
                  className="w-full p-1 border rounded font-light"
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
                  className="w-full p-1 border rounded font-light"
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
                  className="w-full p-1 border rounded font-light"
                  placeholder="Filtrar"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredActivities?.map((agriculture, index) => {
              const agri = agriculture as AgricultureProps;
              return (
                <tr key={index} className="text-center border">
                  <td className="border p-2">{agri.distrito}</td>
                  <td className="border p-2">{agri.cultura}</td>
                  <td className="border p-2">{agri.data_plantio}</td>
                  <td className="border p-2">{agri.data_colheita}</td>
                  <td className="border p-2">{agri.producao_ano}</td>
                  <td className="border p-2">{agri.area_cultivo}</td>
                  <td className="border p-2">
                    {agri.irrigacao ? "Sim" : "Não"}
                  </td>
                  <td className="border p-2">
                    {agri.valor_comercializado.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="border p-2">{agri.destinacao_venda}</td>
                  <td className="border p-2">{agri.destinacao_casa}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
}
