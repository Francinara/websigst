import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";
import {
  CaretDoubleLeft,
  Check,
  Plus,
  Square,
  Trash,
} from "@phosphor-icons/react";
import { FormEvent, useState } from "react";
import { IconButton } from "../../components/ui/IconButton";
import { Button } from "../../components/ui/Button";

export function Users() {
  document.title = "WebSIG, Serra Talhada - PE | Cadastrar";

  const navigate = useNavigate();

  async function handleButton(event: FormEvent) {
    event.preventDefault();
    navigate("/registration");
  }
  const [registrations, setRegistrations] = useState([
    {
      id: 1,
      name: "Francinara Leite Gomes",
      email: "francinara.gomes21@gmail.com",
      requestDate: "21/10/2021 21:10:00",
      accessLevel: "opcao1",
    },
    {
      id: 2,
      name: "João Silva",
      email: "joao.silva@gmail.com",
      requestDate: "22/11/2021 10:20:00",
      accessLevel: "opcao1",
    },
  ]);

  const handleChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    id: number
  ) => {
    const updatedRegistrations = registrations.map((registration) =>
      registration.id === id
        ? { ...registration, accessLevel: event.target.value }
        : registration
    );
    setRegistrations(updatedRegistrations);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.navigation}>
            <Link className={styles.navLink} to="/registration-requests">
              <CaretDoubleLeft size={16} />
              Solicitações de Acesso
            </Link>
          </div>
          <div className={styles.titleSection}>
            <div className={styles.titleContainer}>
              <h1>Usuários</h1>
              {true && (
                <IconButton
                  tooltipTitle="Excluir"
                  icon={<Trash size={25} color="#006400" weight="bold" />}
                />
              )}
            </div>
            <Button type="button" loading={false} onClick={handleButton}>
              <Plus size={20} color="#fff" weight="bold" />
              Cadastrar usuário
            </Button>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr className={styles.tableHead}>
                <th className={styles.tableCellCheckBox}>
                  <IconButton
                    tooltipTitle="Selecionar"
                    icon={<Square size={22} color="#006400" weight="bold" />}
                  />
                </th>
                <th className={styles.tableCellText}>Nome</th>
                <th className={styles.tableCellText}>Email</th>
                <th className={styles.tableCellDate}>Data de Cadastro</th>
                <th className={styles.tableCellAccessLevel}>Nível de acesso</th>
              </tr>
            </thead>

            <tbody>
              {registrations.map((registration) => (
                <tr key={registration.id} className={styles.tableBody}>
                  <td className={styles.tableCellCheckBox}>
                    <IconButton
                      tooltipTitle="Selecionar"
                      icon={<Square size={22} color="#006400" weight="bold" />}
                    />
                  </td>
                  <td className={styles.tableCellText}>{registration.name}</td>
                  <td className={styles.tableCellText}>{registration.email}</td>
                  <td className={styles.tableCellDate}>
                    {registration.requestDate}
                  </td>
                  <td className={styles.tableCellAccessLevel}>
                    <select
                      id={`select-${registration.id}`}
                      value={registration.accessLevel}
                      onChange={(event) => handleChange(event, registration.id)}
                    >
                      <option value="" disabled>
                        Nível de Acesso
                      </option>
                      <option value="opcao1">Comum</option>
                      <option value="opcao2">Administrativo</option>
                    </select>
                  </td>
                  <td className={styles.tableCellActions}>
                    <IconButton
                      tooltipTitle="Excluir"
                      icon={<Trash size={25} color="#777" weight="bold" />}
                    />
                    <IconButton
                      tooltipTitle="Salvar"
                      icon={<Check size={25} color="#777" weight="bold" />}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
