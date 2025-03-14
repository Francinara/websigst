import { useState } from "react";
import { useProductiveActivities } from "../../hooks/useActiviteProductivies";
import { CraftsmanshipProps } from "../../services/productive-activities/productiveActivitiesApi";
import { activityAcess } from "../../utils/constants";

import styles from "./styles.module.scss";

export default function CraftsmanshipTable() {
  const { data: activities, isLoading } = useProductiveActivities(
    activityAcess.craftsmanship
  );

  const [filters, setFilters] = useState({
    distrito: "",
    produto: "",
    destinacao_valor: "",
  });

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredActivities = activities?.filter((activity) => {
    const craft = activity as CraftsmanshipProps;
    return (
      craft.distrito.toLowerCase().includes(filters.distrito.toLowerCase()) &&
      craft.produto.toLowerCase().includes(filters.produto.toLowerCase()) &&
      craft.destinacao_valor
        .toLowerCase()
        .includes(filters.destinacao_valor.toLowerCase())
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
              <th className="border-t border-x p-2">Produto</th>
              <th className="border-t border-x p-2">Destinação Valor</th>
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
                  value={filters.produto}
                  onChange={(e) =>
                    handleFilterChange("produto", e.target.value)
                  }
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
            </tr>
          </thead>
          <tbody>
            {filteredActivities?.map((activity, index) => {
              const craft = activity as CraftsmanshipProps;
              return (
                <tr key={index} className="text-center border">
                  <td className="border p-2">{craft.distrito}</td>
                  <td className="border p-2">{craft.produto}</td>
                  <td className="border p-2">{craft.destinacao_valor}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
}
