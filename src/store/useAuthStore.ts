import { create } from "zustand";
import { api } from "../services/apiClient";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { toast } from "react-toastify";
import { UserProps } from "../services/auth/authApi";
import { RegistrationStatus } from "../utils/constants";

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

type updateStatusRequestRegistrationProps = {
  user_id: number;
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

interface AuthState {
  user: UserProps | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  setUser: (user: UserProps | null) => void;
  setLoading: (loading: boolean) => void;
  signIn: (credentials: { email: string; password: string }) => Promise<void>;
  signOut: () => void;
  registration: (credentials: RegistrationProps) => Promise<void>;
  requestRegistration: (credentials: RequestRegistrationProps) => Promise<void>;
  updateStatusRequestRegistration: (
    credentials: updateStatusRequestRegistrationProps
  ) => Promise<void>;
  listRegistrationRequests: () => Promise<RegistrationRequestProps[]>;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  loading: true,

  setUser: (user) =>
    set({ user, isAuthenticated: !!user, isAdmin: user?.role === "admin" }),
  setLoading: (loading) => set({ loading }),
  signIn: async ({ email, password }) => {
    try {
      const response = await api.post("/session", { email, password });
      const { id, name, role, active, token } = response.data;
      setCookie(undefined, "@websig.token", token, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
      api.defaults.headers["Authorization"] = `Bearer ${token}`;
      set({
        user: { id, name, email, role, active },
        isAuthenticated: true,
        isAdmin: role === "admin",
      });
      window.location.href = "/";
      toast.success("Logado com sucesso");
    } catch (error) {
      toast.error("Erro ao acessar!");
    }
  },

  signOut: () => {
    try {
      destroyCookie(undefined, "@websig.token");
      set({ user: null, isAuthenticated: false, isAdmin: false });
      window.location.href = "/signin";
    } catch (error) {
      console.error("Erro ao deslogar", error);
      toast.error("Erro ao deslogar");
    }
  },
  registration: async ({ name, email, password, role, active }) => {
    try {
      await api.post("/users", {
        name,
        email,
        password,
        role,
        active,
      });
      toast.success("Cadastro realizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao cadastrar usuário!");
      throw error;
    }
  },
  requestRegistration: async ({ name, email, password, role, status }) => {
    try {
      await api.post("/registration-requests", {
        name: name,
        email,
        password,
        role,
        status,
      });
      toast.success("Solicitação de registro enviada com sucesso!");
      window.location.href = "/signin";
    } catch (error) {
      toast.error("Erro ao enviar solicitação de registro!");
    }
  },
  updateStatusRequestRegistration: async ({ user_id, status }) => {
    try {
      await api.put("/registration-requests/status/update", {
        user_id,
        status,
      });
    } catch (error) {
      toast.error("Erro ao enviar atualizar status!");
    }
  },
  listRegistrationRequests: async () => {
    try {
      const response = await api.get("/registration-requests");
      return response.data;
    } catch (error) {
      toast.error("Erro ao listar solicitações de registro!");
      return [];
    }
  },
  initializeAuth: async () => {
    const { "@websig.token": token } = parseCookies();
    if (token) {
      api.defaults.headers["Authorization"] = `Bearer ${token}`;
      try {
        const response = await api.get("/me");
        const { id, name, email, role, active } = response.data;
        set({
          user: { id, name, email, role, active },
          isAuthenticated: true,
          isAdmin: role === "admin",
        });
      } catch (error) {
        get().signOut();
      } finally {
        set({ loading: false });
      }
    } else {
      set({ loading: false });
    }
  },
}));
