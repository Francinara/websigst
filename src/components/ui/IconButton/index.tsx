import { ButtonHTMLAttributes, ReactNode } from "react";
import Tooltip from "@mui/material/Tooltip";
import styles from "./styles.module.scss";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  tooltipTitle: string;
  icon: ReactNode;
}

export function IconButton({
  loading,
  tooltipTitle,
  icon,
  ...rest
}: IconButtonProps) {
  return (
    <Tooltip title={tooltipTitle} arrow disableInteractive>
      <button className={styles.iconButton} disabled={loading} {...rest}>
        {icon}
      </button>
    </Tooltip>
  );
}
