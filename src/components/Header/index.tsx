import { Link, useLocation } from "react-router-dom";
import { Logo } from "../Logo";
import styles from "./styles.module.scss";
import { SignOut } from "@phosphor-icons/react";
import { Tooltip } from "@mui/material";
import useAuth from "../../hooks/useAuth";
import { SignIn } from "@phosphor-icons/react/dist/ssr";

export function Header() {
  const { isAuthenticated, signOut } = useAuth();
  const location = useLocation();

  const hiddenRoutes = ["/signin"];

  return (
    <header className={styles.headerContent}>
      {isAuthenticated ? (
        <Link to="/" className={styles.logo}>
          <Logo />
        </Link>
      ) : (
        <span className={styles.logo}>
          <Logo />
        </span>
      )}
      {isAuthenticated ? (
        <Tooltip title="Desconectar" placement="bottom-start">
          <button
            onClick={signOut}
            className={styles.signOutButton}
            aria-label="Desconectar"
          >
            <SignOut size={20} weight="bold" />
          </button>
        </Tooltip>
      ) : (
        !hiddenRoutes.includes(location.pathname) && (
          <Tooltip title="Entrar" placement="bottom-start">
            <Link
              to="/signin"
              className={styles.signOutButton}
              aria-label="Entrar"
            >
              <SignIn size={20} weight="bold" />
            </Link>
          </Tooltip>
        )
      )}
    </header>
  );
}
