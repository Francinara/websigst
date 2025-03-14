import { useVisits } from "../../hooks/useVisits";
import LineChart from "./charts/LineChart";

export default function VisitsChart() {
  const { data: visits } = useVisits();

  return (
    <div className="p-3 bg-white rounded-lg border flex-1">
      <h2 className="text-base font-semibold text-gray-600 mb-4">
        Visitas ao Logo do Tempo
      </h2>
      {visits && <LineChart datas={visits} selectedChart="" chartName="" />}
    </div>
  );
}
