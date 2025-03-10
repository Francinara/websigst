import { InputHTMLAttributes, useState } from "react";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import styles from "./styles.module.scss";
import { IconButton } from "../IconButton";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const PasswordInput = ({ ...rest }: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.passwordInputContainer}>
      <input
        className={styles.input}
        type={showPassword ? "text" : "password"}
        {...rest}
      />
      <IconButton
        type="button"
        onClick={handleTogglePassword}
        tooltipTitle=""
        icon={showPassword ? <Eye size={20} /> : <EyeSlash size={20} />}
      />
    </div>
  );
};

export default PasswordInput;
