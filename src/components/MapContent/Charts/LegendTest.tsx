import { useEffect, useMemo, useState } from "react";
import { scaleOrdinal, schemeTableau10 } from "d3";
import { Tooltip } from "@mui/material";
import { CompleteProductiveActivity } from "../../../utils/types";
import styles from "./styles.module.scss";
import { usePropertyStore } from "../../../store/usePropertyStore";

interface ActivityData {
  otherActivity: string;
  count: number;
  items: CompleteProductiveActivity[];
}

const processDataByActivity = (
  data: CompleteProductiveActivity[],
  field: keyof CompleteProductiveActivity
) => {
  const activityData: ActivityData[] = [];

  const activityTypes = [...new Set(data.map((item) => item[field] as string))];

  activityTypes.forEach((otherActivity) => {
    const items = data.filter((item) => item[field] === otherActivity);
    if (items.length > 0) {
      activityData.push({
        otherActivity,
        count: items.length,
        items,
      });
    }
  });

  activityData.sort((a, b) => a.otherActivity.localeCompare(b.otherActivity));

  return activityData;
};

export default function LegendTest({
  datas,
  selectedChart,
  field,
  id = "propriedade_id",
}: {
  datas: CompleteProductiveActivity[];
  selectedChart: string;
  field: keyof CompleteProductiveActivity;
  id?: "propriedade_id" | "id";
}) {
  const { propertiesID, updatePropertyID } = usePropertyStore();

  const [data, setDatas] = useState<CompleteProductiveActivity[]>(datas);

  const filteredData = useMemo(() => {
    if (selectedChart !== "select") {
      return datas.filter((property) => propertiesID.includes(property[id]));
    }
    return datas;
  }, [datas, selectedChart, propertiesID, id]);

  useEffect(() => {
    setDatas(filteredData);
    if (selectedChart === "select") {
      updatePropertyID(datas.map((property) => property[id]));
    }
  }, [filteredData, selectedChart, id]);

  const processedData = processDataByActivity(data, field);

  const colorScale = useMemo(() => scaleOrdinal(schemeTableau10), []);

  return (
    <ul className={styles.legendContainer}>
      {processedData.map((d) => (
        <Tooltip
          key={d.otherActivity}
          title={d.otherActivity}
          disableInteractive
        >
          <li>
            <span style={{ backgroundColor: colorScale(d.otherActivity) }} />
            <p>{d.otherActivity}</p>
          </li>
        </Tooltip>
      ))}
    </ul>
  );
}
