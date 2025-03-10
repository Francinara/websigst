import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";
import {
  Calendar,
  CaretDoubleLeft,
  Check,
  MagnifyingGlass,
  Plus,
  Trash,
} from "@phosphor-icons/react";
import { FormEvent, useEffect, useRef, useState, useCallback } from "react";
import { IconButton } from "../../components/ui/IconButton";
import { Button } from "../../components/ui/Button";
import useAuth from "../../hooks/useAuth";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "react-modal";
import { ModalRegistrationRequest } from "../../components/ModalRegistrationRequest";
import { RegistrationStatus } from "../../utils/constants";

type RegistrationRequestProps = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  status: RegistrationStatus;
  requestDate: string;
};

export function RegistrationRequests() {
  const navigate = useNavigate();
  const {
    listRegistrationRequests,
    registration,
    updateStatusRequestRegistration,
  } = useAuth();

  const [registrations, setRegistrations] = useState<
    RegistrationRequestProps[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>(
    RegistrationStatus.Pending
  );
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalText, setModalText] = useState("");
  const [status, setStatus] = useState<RegistrationStatus>(
    RegistrationStatus.Pending
  );
  const [modalVisible, setModalVisible] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "WebSIG, Serra Talhada - PE | Solicitações de Cadastro";
  }, []);

  function handleCloseModal() {
    setModalVisible(false);
  }

  function handleOpenModalView(status: RegistrationStatus) {
    if (status === RegistrationStatus.Approved) {
      setModalText(
        "Você tem certeza que quer cadastrar todos os usuários selecionados?"
      );
    }
    if (status === RegistrationStatus.Rejected) {
      setModalText(
        "Você tem certeza que quer rejeitar todos os usuários selecionados?"
      );
    }
    setStatus(status);
    setModalVisible(true);
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDatePicker = () => {
    setShowDatePicker((prev) => !prev);
  };

  async function fetchRegistrations() {
    const requests = await listRegistrationRequests();
    setRegistrations(requests);
  }

  useEffect(() => {
    fetchRegistrations();
  }, [listRegistrationRequests]);

  const handleRoleChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    id: number
  ) => {
    const updatedRegistrations = registrations.map((registration) =>
      registration.id === id
        ? { ...registration, role: event.target.value }
        : registration
    );
    setRegistrations(updatedRegistrations);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(event.target.value);
    setSelectedItems(new Set());
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedItems((prev) => {
      const newSelectedItems = new Set(prev);
      if (newSelectedItems.has(id)) {
        newSelectedItems.delete(id);
      } else {
        newSelectedItems.add(id);
      }
      return newSelectedItems;
    });
  };

  const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(
        new Set(getFilteredRegistrations().map((item) => item.id))
      );
    } else {
      setSelectedItems(new Set());
    }
  };

  const rejectSelectedItems = async () => {
    await Promise.all(
      Array.from(selectedItems).map(async (id) => {
        const registration = registrations.find((reg) => reg.id === id);
        if (registration) {
          await handleRegistration(
            registration.id,
            registration.name,
            registration.email,
            registration.password,
            registration.role,
            RegistrationStatus.Rejected
          );
        }
      })
    );
  };

  const approveSelectedItems = async () => {
    await Promise.all(
      Array.from(selectedItems).map(async (id) => {
        const registration = registrations.find((reg) => reg.id === id);
        if (registration) {
          await handleRegistration(
            registration.id,
            registration.name,
            registration.email,
            registration.password,
            registration.role,
            RegistrationStatus.Approved
          );
        }
      })
    );
  };

  async function handleButton(event: FormEvent) {
    event.preventDefault();
    navigate("/registration");
  }

  async function handleRegistration(
    id: number,
    name: string,
    email: string,
    password: string,
    role: string,
    status: RegistrationStatus,
    event?: FormEvent
  ) {
    if (event) {
      event.preventDefault();
    }
    if (status === RegistrationStatus.Approved) {
      const data = {
        name: name,
        email: email,
        password: password,
        role: role,
        active: true,
      };

      await registration(data);
      await updateStatusRequestRegistration({
        user_id: id,
        status: status,
      });
    }
    if (status === RegistrationStatus.Rejected) {
      await updateStatusRequestRegistration({
        user_id: id,
        status: status,
      });
    }
    fetchRegistrations();
    navigate("#");
  }

  const getFilteredRegistrations = useCallback(() => {
    const adjustedEndDate = endDate
      ? new Date(new Date(endDate).setHours(23, 59, 59, 999))
      : new Date();

    const adjustedStartDate = startDate
      ? new Date(new Date(startDate).setHours(0, 0, 0, 0))
      : new Date();

    return registrations.filter(
      (registration) =>
        (registration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          registration.email
            .toLowerCase()
            .includes(searchQuery.toLowerCase())) &&
        (selectedStatus === "" || registration.status === selectedStatus) &&
        (startDate === null ||
          endDate === null ||
          (new Date(registration.requestDate) >= adjustedStartDate &&
            new Date(registration.requestDate) <= adjustedEndDate)) &&
        registration.status !== RegistrationStatus.Approved
    );
  }, [registrations, searchQuery, selectedStatus, startDate, endDate]);

  useEffect(() => {
    setSelectedItems(new Set());
  }, [getFilteredRegistrations]);

  const filteredRegistrations = getFilteredRegistrations();

  const isAllSelected =
    filteredRegistrations.length > 0 &&
    selectedItems.size === filteredRegistrations.length;

  const areAllSelectedItemsPending = () => {
    return Array.from(selectedItems).every((id) => {
      const registration = registrations.find((reg) => reg.id === id);
      return (
        registration && registration.status !== RegistrationStatus.Rejected
      );
    });
  };

  async function handleFinishModal(status: RegistrationStatus) {
    if (status === RegistrationStatus.Rejected) {
      rejectSelectedItems();
    }
    if (status === RegistrationStatus.Approved) {
      approveSelectedItems();
    }
    setModalVisible(false);
  }

  Modal.setAppElement("#root");

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.navigation}>
            <Link className={styles.navLink} to="/">
              <CaretDoubleLeft size={16} />
              Início
            </Link>
            {/* <Link to="/users">Ver usuários cadastrados</Link> */}
          </div>
          <div className={styles.titleSection}>
            <div className={styles.titleContainer}>
              <h1>Solicitações de Acesso</h1>
              {selectedItems.size > 0 && (
                <div className={styles.iconButtonContainer}>
                  {areAllSelectedItemsPending() && (
                    <IconButton
                      tooltipTitle="Rejeitar Selecionados"
                      icon={<Trash size={25} color="#006400" weight="bold" />}
                      onClick={() =>
                        handleOpenModalView(RegistrationStatus.Rejected)
                      }
                    />
                  )}
                  <IconButton
                    tooltipTitle="Aceitar Selecionados"
                    icon={<Check size={25} color="#006400" weight="bold" />}
                    onClick={() =>
                      handleOpenModalView(RegistrationStatus.Approved)
                    }
                  />
                </div>
              )}
              <div className={styles.searchBar}>
                <IconButton
                  tooltipTitle="Pesquisar"
                  icon={
                    <MagnifyingGlass size={14} color="#006400" weight="bold" />
                  }
                  onClick={() => searchInputRef.current?.focus()}
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Pesquisar"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div>
                <select value={selectedStatus} onChange={handleStatusChange}>
                  <option value="">Todos</option>
                  <option value={RegistrationStatus.Pending}>Pendente</option>
                  <option value={RegistrationStatus.Rejected}>Rejeitado</option>
                </select>
              </div>
              <div></div>
            </div>

            <div>
              <Button type="button" loading={false} onClick={handleButton}>
                <Plus size={20} color="#fff" weight="bold" />
                Cadastrar usuário
              </Button>
            </div>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr className={styles.tableHead}>
                <th className={styles.tableCellCheckBox}>
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAllChange}
                  />
                </th>
                <th className={styles.tableCellText}>Nome</th>
                <th className={styles.tableCellText}>Email </th>
                <th className={styles.tableCellDate}>
                  Data de solicitação
                  <IconButton
                    tooltipTitle="Selecionar Data"
                    icon={<Calendar size={20} color="#777" weight="bold" />}
                    onClick={toggleDatePicker}
                  />
                  <div className={styles.datePickerWrapper} ref={datePickerRef}>
                    {showDatePicker && (
                      <DatePicker
                        selected={startDate}
                        onChange={([start, end]) => {
                          setStartDate(start);
                          setEndDate(end);
                        }}
                        startDate={startDate}
                        endDate={endDate}
                        selectsRange
                        inline
                        className={styles.datePicker}
                      />
                    )}
                  </div>
                </th>
                <th className={styles.tableCellAccessLevel}>
                  Nível de acesso{" "}
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredRegistrations.map((registration) => (
                <tr key={registration.id} className={styles.tableBody}>
                  <td className={styles.tableCellCheckBox}>
                    <input
                      type="checkbox"
                      checked={selectedItems.has(registration.id)}
                      onChange={() => handleCheckboxChange(registration.id)}
                    />
                  </td>
                  <td className={styles.tableCellText}>{registration.name}</td>
                  <td className={styles.tableCellText}>{registration.email}</td>
                  <td className={styles.tableCellDate}>
                    {new Date(registration.requestDate).toLocaleString()}
                  </td>
                  <td className={styles.tableCellAccessLevel}>
                    <select
                      id={`select-${registration.id}`}
                      value={registration.role}
                      onChange={(event) =>
                        handleRoleChange(event, registration.id)
                      }
                    >
                      <option value="" disabled>
                        Nível de Acesso
                      </option>
                      <option value="comum">Comum</option>
                      <option value="admin">Administrativo</option>
                    </select>
                  </td>
                  <td className={styles.tableCellActions}>
                    {registration.status !== RegistrationStatus.Rejected && (
                      <IconButton
                        tooltipTitle="Rejeitar"
                        icon={<Trash size={25} color="#777" weight="bold" />}
                        onClick={(event) =>
                          handleRegistration(
                            registration.id,
                            registration.name,
                            registration.email,
                            registration.password,
                            registration.role,
                            RegistrationStatus.Rejected,
                            event
                          )
                        }
                      />
                    )}
                    <IconButton
                      tooltipTitle="Aceitar"
                      icon={<Check size={25} color="#777" weight="bold" />}
                      onClick={(event) =>
                        handleRegistration(
                          registration.id,
                          registration.name,
                          registration.email,
                          registration.password,
                          registration.role,
                          RegistrationStatus.Approved,
                          event
                        )
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {modalVisible && (
          <ModalRegistrationRequest
            status={status}
            isOpen={modalVisible}
            onRequestClose={handleCloseModal}
            text={modalText}
            handleFinishModal={handleFinishModal}
          />
        )}
      </div>
    </>
  );
}
