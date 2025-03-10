import styles from "./styles.module.scss";

type FilterSelectProps = {
  type: string;
  category: {
    selected: string;
    onChange: (culture: string) => void;
    options: string[];
  };
  district: {
    selected: string;
    onChange: (district: string) => void;
    options: string[] | undefined;
  };
  year: {
    selectedFirst: number;
    onChangeFirst: (year: number) => void;
    selectedLast: number;
    onChangeLast: (year: number) => void;
    options: number[] | undefined;
  };
};

export default function FilterSelect({
  type,
  category,
  district,
  year,
}: FilterSelectProps) {
  return (
    <div className={styles.filterSelectContainer}>
      <label>
        <div className={styles.title}>{type}</div>
        <select
          className={styles.select}
          value={category.selected}
          onChange={(e) => category.onChange(e.target.value)}
        >
          <option value="all">Todas</option>
          {category.options.map((culture) => (
            <option key={culture} value={culture}>
              {culture}
            </option>
          ))}
        </select>
      </label>
      <label>
        <div className={styles.title}>Distritos</div>
        <select
          className={styles.select}
          value={district.selected}
          onChange={(e) => district.onChange(e.target.value)}
        >
          <option key="all" value="all">
            Todas
          </option>
          {district.options?.map((dist) => (
            <option key={dist} value={dist}>
              {dist}
            </option>
          ))}
        </select>
      </label>
      <div className={styles.yearRange}>
        <label>
          <div className={styles.yearRangeTitle}>Inicio</div>
          <select
            value={year.selectedFirst}
            onChange={(e) => year.onChangeFirst(Number(e.target.value))}
          >
            {year.options?.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </label>
        <label>
          <div className={styles.yearRangeTitle}>Fim</div>
          <select
            value={year.selectedLast}
            onChange={(e) => year.onChangeLast(Number(e.target.value))}
          >
            {year.options?.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
