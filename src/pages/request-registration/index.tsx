import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

import styles from "../../styles/login.module.scss";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import PasswordInput from "../../components/ui/PasswordInput";
import useAuth from "../../hooks/useAuth";
import { RegistrationStatus } from "../../utils/constants";
import isValidEmail from "../../utils/isValidEmail";

export function RequestRegistration() {
  document.title = "WebSIG, Serra Talhada - PE | Solicitar cadastro";

  const { requestRegistration } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleRequestRegistration(event: FormEvent) {
    event.preventDefault();

    if (email == "" || password == "" || name == "") {
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
      role: "user",
      status: RegistrationStatus.Pending,
    };

    await requestRegistration(data);

    setLoading(false);
  }
  return (
    <>
      <div className={styles.container}>
        <div className={styles.containerCenter}>
          <span>Solicitar Acesso</span>
          <div className={styles.login}>
            <form onSubmit={handleRequestRegistration}>
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
              <div className={styles.loginButton}>
                <Button type="submit" loading={loading}>
                  Solicitar Acesso
                </Button>
              </div>
            </form>
          </div>
          <div className={styles.accessInfo}>
            <p>Já possui acesso?</p>
            <Link to="/signin">Entrar</Link>
          </div>
        </div>
      </div>
    </>
  );
}
