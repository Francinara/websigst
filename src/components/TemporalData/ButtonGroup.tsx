import { Dispatch, SetStateAction } from "react";
import { VisibilityOptions } from "../../utils/types";
import styles from "./styles.module.scss";

interface ButtonGroupProps {
  options: string[];
  selectedButton: VisibilityOptions;
  setSelectedButton: Dispatch<SetStateAction<VisibilityOptions>>;
  setSelectedIntervals: Dispatch<SetStateAction<string[]>>;
}

export default function ButtonGroup({
  options,
  selectedButton,
  setSelectedButton,
  setSelectedIntervals,
}: ButtonGroupProps) {
  function onButtonSelect(button: VisibilityOptions) {
    setSelectedIntervals([]);
    setSelectedButton(button);
  }

  if (options.length <= 1) {
    return null;
  }

  return (
    <div className={styles.buttonGroupContainer}>
      {options.length > 1
        ? options.map((option) => (
            <button
              key={option}
              className={
                selectedButton === option ? styles.buttonActive : styles.button
              }
              onClick={() => onButtonSelect(option as VisibilityOptions)}
            >
              {option}
            </button>
          ))
        : null}
    </div>
  );
}
