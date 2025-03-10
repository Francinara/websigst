import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

import styles from "../../styles/login.module.scss";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import PasswordInput from "../../components/ui/PasswordInput";
import useAuth from "../../hooks/useAuth";

export function SignIn() {
  document.title = "WebSIG, Serra Talhada - PE | Login";

  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    if (email == "" || password == "") {
      toast.error("Preencha todos os campos.");
      return;
    }

    setLoading(true);

    const data = {
      email: email.toLowerCase(),
      password: password,
    };

    await signIn(data);
    setLoading(false);
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.containerCenter}>
          <span>Fazer Login</span>
          <div className={styles.login}>
            <form onSubmit={handleLogin}>
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
                  Entrar
                </Button>
              </div>
            </form>
          </div>
          <div className={styles.accessInfo}>
            <p>Ainda não possui acesso?</p>
            <Link to="/request-registration">Solicitar acesso</Link>
          </div>
        </div>
      </div>
    </>
  );
}
