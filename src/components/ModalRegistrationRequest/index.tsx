import Modal from "react-modal";
import styles from "./styles.module.scss";
import { X } from "@phosphor-icons/react";
import { Button } from "../ui/Button";
import { RegistrationStatus } from "../../utils/constants";

interface ModalProps {
  status: RegistrationStatus;
  isOpen: boolean;
  onRequestClose: () => void;
  text: string;
  handleFinishModal: (status: RegistrationStatus) => void;
}

export function ModalRegistrationRequest({
  status,
  isOpen,
  onRequestClose,
  text,
  handleFinishModal,
}: ModalProps) {
  const customStyles = {
    content: {
      top: "50%",
      bottom: "auto",
      left: "50%",
      right: "auto",
      padding: "20px",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#fff",
      borderRadius: "8px",
      zIndex: 2000,
    },
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
      <button
        type="button"
        onClick={onRequestClose}
        className="react-modal-close"
        style={{ background: "transparent", border: 0 }}
      >
        <X size={22} color="#006400" weight="bold" />
      </button>
      <div>
        <div>
          <span>{text}</span>
        </div>
        <div className={styles.buttonContainer}>
          <Button onClick={() => handleFinishModal(status)}>Sim</Button>
        </div>
      </div>
    </Modal>
  );
}
