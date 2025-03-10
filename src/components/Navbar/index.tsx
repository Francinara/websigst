import { NavLink, useLocation } from "react-router-dom";
import styles from "./styles.module.scss";
import useAuth from "../../hooks/useAuth";
import { List } from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useUIStore } from "../../store/useUIStore";

export function Navbar() {
  const { isAdmin } = useAuth();
  const { isSidebarVisible } = useUIStore();

  const location = useLocation();

  const [isNavVisible, setIsNavVisible] = useState<boolean>(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  const handleSidebarToggle = useCallback(() => {
    setIsNavVisible((prev) => !prev);
  }, []);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target as Node)
    ) {
      setIsNavVisible(false);
    }
  }, []);

  useEffect(() => {
    if (isSidebarVisible) {
      setIsNavVisible(false);
    }
  }, [isSidebarVisible]);

  useEffect(() => {
    if (isNavVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNavVisible]);

  const links = [
    { path: "/", label: "Mapa" },
    // { path: "/relatorio", label: "Visão Geral" },
    { path: "/temporal-data", label: "Dados Temporais" },
  ];

  return (
    <>
      {isNavVisible && <div className={styles.overlay}></div>}
      <div className={styles.navbar}>
        <div className={styles.navbarLinks}>
          {links.map(({ path, label }) => (
            <NavLink
              key={path}
              className={`${styles.navbarLink} ${
                location.pathname === path ? styles.active : ""
              }`}
              to={path}
            >
              {label}
            </NavLink>
          ))}
        </div>
        {isAdmin && (
          <div className={styles.navbarLinks}>
            <NavLink
              className={`${styles.navbarLink}
                ${
                  location.pathname === "/registration-requests"
                    ? styles.active
                    : ""
                }
              `}
              to="/registration-requests"
            >
              Solicitações de acesso
            </NavLink>
          </div>
        )}
        <button className={styles.buttonMobile} onClick={handleSidebarToggle}>
          <List size={20} />
        </button>
      </div>
      {isNavVisible && (
        <div className={styles.sidebarContainer}>
          <aside className={styles.sidebar} ref={sidebarRef}>
            <div className={styles.sidebarHeader}>
              <div>
                <h1>Menu</h1>
              </div>

              <button
                className={styles.buttonMobile}
                onClick={handleSidebarToggle}
              >
                <List size={20} />
              </button>
            </div>
            <div className={styles.sidebarContent}>
              <div className={styles.sidebarLinks}>
                {links.map(({ path, label }) => (
                  <NavLink
                    key={path}
                    className={`${styles.sidebarLink} ${
                      location.pathname === path ? styles.active : ""
                    }`}
                    to={path}
                  >
                    {label}
                  </NavLink>
                ))}
              </div>
              <div className={styles.sidebarLinkGreen}>
                {isAdmin && (
                  <NavLink to="/registration-requests">
                    Solicitações de acesso
                  </NavLink>
                )}
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
