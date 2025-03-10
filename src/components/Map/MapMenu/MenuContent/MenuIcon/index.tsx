import { ButtonHTMLAttributes, ReactNode } from "react";
import { Tooltip } from "react-tooltip";
import styles from "./styles.module.scss";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  tooltipTitle: string;
  icon: ReactNode;
  isActive?: boolean;
  tooltipPlace?: "top" | "bottom" | "left" | "right";
}

export function MenuIcon({
  loading,
  tooltipTitle,
  icon,
  isActive = false,
  tooltipPlace = "bottom",
  ...rest
}: IconButtonProps) {
  return (
    <>
      <button
        data-tooltip-id="my-tooltip"
        data-tooltip-content={tooltipTitle}
        data-tooltip-place={tooltipPlace}
        className={`${styles.iconButton} ${
          isActive ? styles.activeButton : ""
        }`}
        disabled={loading}
        {...rest}
      >
        {icon}
      </button>
      <Tooltip id="my-tooltip" className="tooltip" />
      <style>
        {`
          .tooltip {
            color: #ccc;
            padding: 0.2rem 0.5rem;
            border-radius: 0px;
            border: 0.5px solid #ccc;
            background-color: #333;
            font-family: Roboto;
            font-size: 11px;
            z-index: 10000;
          }
        `}
      </style>
    </>
  );
}
