import { useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { Navbar } from "../../components/Navbar";
import styles from "./styles.module.scss";
import { customStyles } from "../temporal-data";
import { tableMap } from "../../utils/constants";
import Select from "react-select";
import AgricultureTable from "../../components/relatorio/AgricultureTable";
import LivestockTable from "../../components/relatorio/LivestockTable";
import BeekeepingTable from "../../components/relatorio/BeekeepingTable";
import CraftsmanshipTable from "../../components/relatorio/CraftsmanshipTable";
import OtherActivitiesTable from "../../components/relatorio/OtherActivitiesTable";
import AquacultureTable from "../../components/relatorio/AquacultureTable";
import {
  Cow,
  Fish,
  HandCoins,
  House,
  Notepad,
  Plant,
  Plus,
  Printer,
} from "@phosphor-icons/react";
import { HiveOutlined } from "@mui/icons-material";
import PropertyWithBeneficiaryTable from "../../components/relatorio/PropertyWithBeneficiaryTable";
import VisitsTable from "../../components/relatorio/VisitsTable";
import { useReactToPrint } from "react-to-print";
import { Tooltip } from "@mui/material";

export const activityOptions = [
  {
    value: tableMap.propriedade,
    label: (
      <div className={styles.activityOptions}>
        <House size={20} weight="bold" /> {tableMap.agricultura}
      </div>
    ),
    icon: <House size={20} weight="bold" />,
  },
  {
    value: tableMap.agricultura,
    label: (
      <div className={styles.activityOptions}>
        <Plant size={20} weight="bold" /> {tableMap.agricultura}
      </div>
    ),
    icon: <Plant size={20} weight="bold" />,
  },
  {
    value: tableMap.pecuaria,
    label: (
      <div className={styles.activityOptions}>
        <Cow size={20} weight="bold" /> {tableMap.pecuaria}
      </div>
    ),
    icon: <Cow size={20} weight="bold" />,
  },
  {
    value: tableMap.aquicultura,
    label: (
      <div className={styles.activityOptions}>
        <Fish size={20} weight="bold" /> {tableMap.aquicultura}
      </div>
    ),
    icon: <Fish size={20} weight="bold" />,
  },
  {
    value: tableMap.apicultura,
    label: (
      <div className={styles.activityOptions}>
        <HiveOutlined sx={{ fontSize: 20 }} /> {tableMap.apicultura}
      </div>
    ),
    icon: <HiveOutlined sx={{ fontSize: 20 }} />,
  },
  {
    value: tableMap.artesanato,
    label: (
      <div className={styles.activityOptions}>
        <HandCoins size={20} weight="bold" /> {tableMap.artesanato}
      </div>
    ),
    icon: <HandCoins size={20} weight="bold" />,
  },
  {
    value: tableMap.outras_atividades,
    label: (
      <div className={styles.activityOptions}>
        <Plus size={20} weight="bold" /> {tableMap.outras_atividades}
      </div>
    ),
    icon: <Plus size={20} weight="bold" />,
  },
  {
    value: tableMap.visitas,
    label: (
      <div className={styles.activityOptions}>
        <Notepad size={20} weight="bold" /> {tableMap.visitas}
      </div>
    ),
    icon: <Notepad size={20} weight="bold" />,
  },
];

const Relatorio = () => {
  const [selectedOption, setSelectedOption] = useState(activityOptions[0]);

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  return (
    <>
      <div className={styles.container}>
        <Navbar />
        <div className={styles.temporalDataContainer}>
          <nav className={styles.temporalDataNavbar}>
            {activityOptions.map((option) => (
              <div
                key={option.value}
                onClick={() =>
                  setSelectedOption(
                    option as {
                      value: tableMap;
                      label: JSX.Element;
                      icon: JSX.Element;
                    }
                  )
                }
                className={
                  selectedOption.value === option.value
                    ? `${styles.option} ${styles.active}`
                    : styles.option
                }
              >
                {option.label}
              </div>
            ))}
          </nav>
          <div className={styles.temporalDataContent}>
            <nav className={styles.temporalDataSelect}>
              <Select
                options={activityOptions}
                value={selectedOption}
                onChange={(option) =>
                  setSelectedOption(
                    option as {
                      value: tableMap;
                      label: JSX.Element;
                      icon: JSX.Element;
                    }
                  )
                }
                styles={customStyles}
                isSearchable={false}
              />
            </nav>
            <div ref={contentRef} className={styles.temporalDataSection}>
              <header className="flex gap-4">
                <h1> {selectedOption.value}</h1>
                <Tooltip title="Imprimir Tabela">
                  <button onClick={() => reactToPrintFn()}>
                    <Printer size={28} />
                  </button>
                </Tooltip>
              </header>
              <div className={styles.content}>
                {selectedOption.value === tableMap.propriedade && (
                  <>
                    <PropertyWithBeneficiaryTable />
                  </>
                )}
                {selectedOption.value === tableMap.agricultura && (
                  <>
                    <AgricultureTable />
                  </>
                )}
                {selectedOption.value === tableMap.pecuaria && (
                  <>
                    <LivestockTable />
                  </>
                )}
                {selectedOption.value === tableMap.apicultura && (
                  <>
                    <BeekeepingTable />
                  </>
                )}
                {selectedOption.value === tableMap.artesanato && (
                  <>
                    <CraftsmanshipTable />
                  </>
                )}
                {selectedOption.value === tableMap.outras_atividades && (
                  <>
                    <OtherActivitiesTable />
                  </>
                )}
                {selectedOption.value === tableMap.aquicultura && (
                  <>
                    <AquacultureTable />
                  </>
                )}
                {selectedOption.value === tableMap.visitas && (
                  <>
                    <VisitsTable />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Relatorio;
