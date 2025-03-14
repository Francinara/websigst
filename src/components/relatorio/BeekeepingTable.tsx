import { useState } from "react";
import { useProductiveActivities } from "../../hooks/useActiviteProductivies";
import { BeekeepingProps } from "../../services/productive-activities/productiveActivitiesApi";
import { activityAcess } from "../../utils/constants";
import styles from "./styles.module.scss";

export default function BeekeepingTable() {
  const { data: activities, isLoading } = useProductiveActivities(
    activityAcess.beekeeping
  );

  const [filters, setFilters] = useState({
    distrito: "",
    n_colmeias: "",
    destinacao_mel: "",
    com_ferrao: "",
    sem_ferrao: "",
  });

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredActivities = activities?.filter((activity) => {
    const bee = activity as BeekeepingProps;
    return (
      bee.distrito.toLowerCase().includes(filters.distrito.toLowerCase()) &&
      (filters.n_colmeias === "" ||
        bee.n_colmeias.toString().includes(filters.n_colmeias)) &&
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
          .includes(filters.sem_ferrao.toLowerCase()))
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
              <th className="border-t border-x  p-2">Distrito</th>
              <th className="border-t border-x  p-2">Nº Colmeias</th>
              <th className="border-t border-x p-2">Destinação Mel</th>
              <th className="border-t border-x  p-2">Com Ferrão</th>
              <th className="border-t border-x p-2">Sem Ferrão</th>
            </tr>
            <tr className="bg-stone-100">
              <th className="border-x  p-1">
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
              <th className="border-x  p-1">
                <input
                  type="text"
                  value={filters.n_colmeias}
                  onChange={(e) =>
                    handleFilterChange("n_colmeias", e.target.value)
                  }
                  className="w-full p-1 border rounded font-normal"
                  placeholder="Filtrar"
                />
              </th>
              <th className="border-x  p-1">
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
              <th className="border-x  p-1">
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
              <th className="border-x  p-1">
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
            </tr>
          </thead>
          <tbody>
            {filteredActivities?.map((activity, index) => {
              const bee = activity as BeekeepingProps;
              return (
                <tr key={index} className="text-center border">
                  <td className="border p-2">{bee.distrito}</td>
                  <td className="border p-2">{bee.n_colmeias}</td>
                  <td className="border p-2">{bee.destinacao_mel}</td>
                  <td className="border p-2">
                    {bee.com_ferrao ? "Sim" : "Não"}
                  </td>
                  <td className="border p-2">
                    {bee.sem_ferrao ? "Sim" : "Não"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
}
