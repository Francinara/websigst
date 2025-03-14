import { useState } from "react";
import { useProductiveActivities } from "../../hooks/useActiviteProductivies";
import { OtherActivitiesProps } from "../../services/productive-activities/productiveActivitiesApi";
import { activityAcess } from "../../utils/constants";

import styles from "./styles.module.scss";

export default function OtherActivitiesTable() {
  const { data: activities, isLoading } = useProductiveActivities(
    activityAcess.other_activities
  );

  const [filters, setFilters] = useState({
    distrito: "",
    tipo: "",
    descricao: "",
  });

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredActivities = activities?.filter((activity) => {
    const other = activity as OtherActivitiesProps;
    return (
      other.distrito.toLowerCase().includes(filters.distrito.toLowerCase()) &&
      other.tipo.toLowerCase().includes(filters.tipo.toLowerCase()) &&
      other.descricao.toLowerCase().includes(filters.descricao.toLowerCase())
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
              <th className="border-t border-x p-2">Tipo</th>
              <th className="border-t border-x p-2">Descrição</th>
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
            </tr>
          </thead>
          <tbody>
            {filteredActivities?.map((activity, index) => {
              const other = activity as OtherActivitiesProps;
              return (
                <tr key={index} className="text-center border">
                  <td className="border p-2">{other.distrito}</td>
                  <td className="border p-2">{other.tipo}</td>
                  <td className="border p-2">{other.descricao}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
}
