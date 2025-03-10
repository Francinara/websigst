import { Navbar } from "../../components/Navbar";
import {
  AgricultureProps,
  AquacultureProps,
  BeekeepingProps,
  CraftsmanshipProps,
  LivestockProps,
  OtherActivitiesProps,
} from "../../contexts/MapContext/types";
import useMapa from "../../hooks/useMapa";
import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { activityAcess, activityMap } from "../../utils/constants";
import {
  ChartLine,
  Cow,
  Fish,
  HandCoins,
  Plant,
  Plus,
} from "@phosphor-icons/react";
import Agriculture from "../../components/TemporalData/ChartContainer/Agriculture";
import Livestock from "../../components/TemporalData/ChartContainer/Livestock";
import Aquaculture from "../../components/TemporalData/ChartContainer/Aquaculture";
import Craftsmanship from "../../components/TemporalData/ChartContainer/Craftsmanship";
import Beekeeping from "../../components/TemporalData/ChartContainer/Beekeeping";
import OtherActivities from "../../components/TemporalData/ChartContainer/OtherActivities";
import Select, { StylesConfig } from "react-select";
import { HiveOutlined } from "@mui/icons-material";

export interface ProductiveActivities {
  agriculture: AgricultureProps[];
  livestock: LivestockProps[];
  aquaculture: AquacultureProps[];
  beekeeping: BeekeepingProps[];
  craftsmanship: CraftsmanshipProps[];
  otherActivities: OtherActivitiesProps[];
}

export const activityOptions = [
  {
    value: activityMap.agricultura,
    label: (
      <div className={styles.activityOptions}>
        <Plant size={20} weight="bold" /> {activityMap.agricultura}
      </div>
    ),
    icon: <Plant size={20} weight="bold" />,
  },
  {
    value: activityMap.pecuaria,
    label: (
      <div className={styles.activityOptions}>
        <Cow size={20} weight="bold" /> {activityMap.pecuaria}
      </div>
    ),
    icon: <Cow size={20} weight="bold" />,
  },
  {
    value: activityMap.aquicultura,
    label: (
      <div className={styles.activityOptions}>
        <Fish size={20} weight="bold" /> {activityMap.aquicultura}
      </div>
    ),
    icon: <Fish size={20} weight="bold" />,
  },
  {
    value: activityMap.apicultura,
    label: (
      <div className={styles.activityOptions}>
        <HiveOutlined sx={{ fontSize: 20 }} /> {activityMap.apicultura}
      </div>
    ),
    icon: <HiveOutlined sx={{ fontSize: 20 }} />,
  },
  {
    value: activityMap.artesanato,
    label: (
      <div className={styles.activityOptions}>
        <HandCoins size={20} weight="bold" /> {activityMap.artesanato}
      </div>
    ),
    icon: <HandCoins size={20} weight="bold" />,
  },
  {
    value: activityMap.outras_atividades,
    label: (
      <div className={styles.activityOptions}>
        <Plus size={20} weight="bold" /> {activityMap.outras_atividades}
      </div>
    ),
    icon: <Plus size={20} weight="bold" />,
  },
];

export const customStyles: StylesConfig = {
  control: (provided) => ({
    ...provided,
    borderRadius: "8px",
    borderColor: "#e7e5e4",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#aaa",
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#78716c",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#78716c",
    fontWeight: "bold",
  }),
  option: (provided, state) => ({
    ...provided,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: state.isFocused ? "#fafaf9" : "#fff",
    color: "#78716c",
  }),
};

export default function TemporalData() {
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(activityOptions[0]);
  const { listProductiveActivityByActivity } = useMapa();

  const [productiveActivities, setProductiveActivities] =
    useState<ProductiveActivities>({
      agriculture: [],
      livestock: [],
      aquaculture: [],
      beekeeping: [],
      craftsmanship: [],
      otherActivities: [],
    });

  const [hasProductiveActivity, setHasProductiveActivity] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      const agriculture = (await listProductiveActivityByActivity(
        activityAcess.agriculture
      )) as AgricultureProps[];

      const livestock = (await listProductiveActivityByActivity(
        activityAcess.livestock
      )) as LivestockProps[];
      const aquaculture = (await listProductiveActivityByActivity(
        activityAcess.aquaculture
      )) as AquacultureProps[];

      const craftsmanship = (await listProductiveActivityByActivity(
        activityAcess.craftsmanship
      )) as CraftsmanshipProps[];
      const beekeeping = (await listProductiveActivityByActivity(
        activityAcess.beekeeping
      )) as BeekeepingProps[];
      const otherActivities = (await listProductiveActivityByActivity(
        activityAcess.other_activities
      )) as OtherActivitiesProps[];

      const hasActivity =
        agriculture.length > 0 ||
        livestock.length > 0 ||
        aquaculture.length > 0 ||
        beekeeping.length > 0 ||
        craftsmanship.length > 0 ||
        otherActivities.length > 0;

      setProductiveActivities({
        agriculture,
        livestock,
        aquaculture,
        beekeeping,
        craftsmanship,
        otherActivities,
      } as ProductiveActivities);

      setLoading(false);
      setHasProductiveActivity(hasActivity);
    }
    fetchData();
  }, [listProductiveActivityByActivity]);

  return (
    <div className={styles.container}>
      <Navbar />
      {!hasProductiveActivity ? (
        <>
          {loading && (
            <div className={styles.loadingOverlay}>
              <div className={styles.loaderCircle}></div>
            </div>
          )}
          <div className={styles.noProperties}>
            <ChartLine size={80} weight="duotone" className={styles.icon} />
            <h2>Nenhuma propriedade cadastrada</h2>{" "}
            <p>
              Para visualizar os dados temporais, é necessário ter pelo menos
              uma propriedade cadastrada.
            </p>
          </div>
        </>
      ) : (
        <div className={styles.temporalDataContainer}>
          <nav className={styles.temporalDataNavbar}>
            {activityOptions.map((option) => (
              <div
                key={option.value}
                onClick={() =>
                  setSelectedOption(
                    option as {
                      value: activityMap;
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
                      value: activityMap;
                      label: JSX.Element;
                      icon: JSX.Element;
                    }
                  )
                }
                styles={customStyles}
                isSearchable={false}
              />
            </nav>

            <div className={styles.temporalDataSection}>
              <header>
                <h1>Dados Temporais - {selectedOption.value}</h1>
              </header>
              <div className={styles.content}>
                {loading && (
                  <div className={styles.loadingOverlay}>
                    <div className={styles.loaderCircle}></div>
                  </div>
                )}
                {selectedOption.value === activityMap.agricultura && (
                  <>
                    <Agriculture data={productiveActivities.agriculture} />
                  </>
                )}
                {selectedOption.value === activityMap.pecuaria && (
                  <>
                    <Livestock data={productiveActivities.livestock} />
                  </>
                )}
                {selectedOption.value === activityMap.apicultura && (
                  <>
                    <Beekeeping data={productiveActivities.beekeeping} />
                  </>
                )}
                {selectedOption.value === activityMap.artesanato && (
                  <>
                    <Craftsmanship data={productiveActivities.craftsmanship} />
                  </>
                )}
                {selectedOption.value === activityMap.outras_atividades && (
                  <>
                    <OtherActivities
                      data={productiveActivities.otherActivities}
                    />
                  </>
                )}
                {selectedOption.value === activityMap.aquicultura && (
                  <>
                    <Aquaculture data={productiveActivities.aquaculture} />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
