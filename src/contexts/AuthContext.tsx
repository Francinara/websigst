import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/apiClient";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { RegistrationStatus } from "../utils/constants";

type AuthContextData = {
  user: UserProps | undefined;
  isAuthenticated: boolean;
  isAdmin: boolean | undefined;
  loading: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signOut: () => void;
  registration: (credentials: RegistrationProps) => Promise<void>;
  requestRegistration: (credentials: RequestRegistrationProps) => Promise<void>;
  updateStatusRequestRegistration: (
    credentials: updateStatusRequestRegistrationProps
  ) => Promise<void>;
  listRegistrationRequests: () => Promise<RegistrationRequestProps[]>;
};

type UserProps = {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
};

type SignInProps = {
  email: string;
  password: string;
};

type RegistrationProps = {
  name: string;
  email: string;
  password: string;
  role: string;
  active: boolean;
};

type RequestRegistrationProps = {
  name: string;
  email: string;
  password: string;
  role: string;
  status: RegistrationStatus;
};

type RegistrationRequestProps = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  status: RegistrationStatus;
  requestDate: string;
};

type updateStatusRequestRegistrationProps = {
  user_id: number;
  status: RegistrationStatus;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
  try {
    destroyCookie(undefined, "@websig.token");
    window.location.href = "/signin";
  } catch {
    console.log("Erro ao deslogar");
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserProps>();
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const { "@websig.token": token } = parseCookies();

    if (token) {
      api.defaults.headers["Authorization"] = `Bearer ${token}`;

      api
        .get("/me")
        .then((response) => {
          const { id, name, email, role, active } = response.data;
          setUser({ id, name, email, role, active });
        })
        .catch(() => {
          signOut();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  async function signIn({ email, password }: SignInProps) {
    try {
      const response = await api.post("/session", { email, password });

      const { id, name, role, active, token } = response.data;
      setCookie(undefined, "@websig.token", token, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });

      setUser({
        id,
        name,
        email,
        role,
        active,
      });

      api.defaults.headers["Authorization"] = `Bearer ${token}`;

      toast.success("Logado com sucesso");

      navigate("/home");
    } catch (error) {
      toast.error("Error ao acessar!");
    }
  }

  async function registration({
    name,
    email,
    password,
    role,
    active,
  }: RegistrationProps) {
    try {
      await api.post("/users", {
        name,
        email,
        password,
        role,
        active,
      });
      toast.success(`Usuário cadastrado com sucesso!`);
    } catch (error) {
      toast.error("Error ao cadastrar usuário!");
    }
  }

  async function requestRegistration({
    name,
    email,
    password,
    role,
    status,
  }: RequestRegistrationProps) {
    try {
      await api.post("/registration-requests", {
        name: name,
        email,
        password,
        role,
        status,
      });
      toast.success("Solicitação de registro enviada com sucesso!");
      navigate("/signin");
    } catch (error) {
      toast.error("Erro ao enviar solicitação de registro!");
    }
  }

  async function updateStatusRequestRegistration({
    user_id,
    status,
  }: updateStatusRequestRegistrationProps) {
    try {
      await api.put("/registration-requests/status/update", {
        user_id,
        status,
      });
    } catch (error) {
      toast.error("Erro ao enviar atualizar status!");
    }
  }

  async function listRegistrationRequests(): Promise<
    RegistrationRequestProps[]
  > {
    try {
      const response = await api.get("/registration-requests");
      return response.data;
    } catch (error) {
      toast.error("Erro ao listar solicitações de registro!");
      return [];
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        loading,
        signIn,
        signOut,
        registration,
        requestRegistration,
        updateStatusRequestRegistration,
        listRegistrationRequests,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
