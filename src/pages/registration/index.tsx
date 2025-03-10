import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { FormEvent, useState } from "react";
import styles from "../../styles/login.module.scss";
import { CaretDoubleLeft } from "@phosphor-icons/react";
import { toast } from "react-toastify";
import PasswordInput from "../../components/ui/PasswordInput";
import useAuth from "../../hooks/useAuth";
import isValidEmail from "../../utils/isValidEmail";

export function Registration() {
  document.title = "WebSIG, Serra Talhada - PE | Cadastrar usuário";

  const navigate = useNavigate();

  const { registration } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const [loading, setLoading] = useState(false);

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value);
  };

  async function handleRegistration(event: FormEvent) {
    event.preventDefault();

    if (email == "" || password == "" || name == "" || role == "") {
      toast.error("Preencha todos os campos.");
      return;
    }
    if (!isValidEmail(email)) {
      toast.error("Por favor, insira um e-mail válido.");
      return;
    }
    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);

    const data = {
      name: name,
      email: email.toLowerCase(),
      password: password,
      role: role,
      active: true,
    };

    await registration(data);
    setLoading(false);
    navigate("/users");
  }

  return (
    <div className={styles.container}>
      <div className={styles.link}>
        <Link className={styles.text} to="/registration-requests">
          <CaretDoubleLeft size={16} />
          Solicitações de Acesso
        </Link>
      </div>
      <div className={styles.containerCenter}>
        <span>Cadastrar Usuário</span>
        <div className={styles.login}>
          <form onSubmit={handleRegistration}>
            <Input
              placeholder="Nome"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder="Email"
              type="text"
              value={email}
              autoComplete="email"
              autoCapitalize="none"
              spellCheck="false"
              onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordInput
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <select value={role} onChange={handleRoleChange}>
              <option value="" disabled>
                Nível de Acesso
              </option>
              <option value="user">Usuário Comum</option>
              <option value="admim">Administrativo</option>
            </select>
            <div className={styles.loginButton}>
              <Button type="submit" loading={loading}>
                Cadastrar Usuário
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
