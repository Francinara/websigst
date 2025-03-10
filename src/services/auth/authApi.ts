import { RegistrationStatus } from "../../utils/constants";
import { api } from "../apiClient";

export type UserProps = {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
};

export type SignInProps = {
  email: string;
  password: string;
};

export type RegistrationProps = {
  name: string;
  email: string;
  password: string;
  role: string;
  active: boolean;
};

export type RequestRegistrationProps = {
  name: string;
  email: string;
  password: string;
  role: string;
  status: RegistrationStatus;
};

export type RegistrationRequestProps = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  status: RegistrationStatus;
  requestDate: string;
};

export const signInApi = async ({ email, password }: SignInProps) => {
  const response = await api.post("/session", { email, password });
  return response.data;
};

export const fetchUser = async () => {
  const response = await api.get("/me");
  return response.data;
};

export const registration = async ({
  name,
  email,
  password,
  role,
  active,
}: RegistrationProps) => {
  return api.post("/users", {
    name,
    email,
    password,
    role,
    active,
  });
};

export const requestRegistrationApi = async (
  data: RequestRegistrationProps
) => {
  return api.post("/registration-requests", data);
};

export const updateStatusRequestApi = async ({
  user_id,
  status,
}: {
  user_id: number;
  status: RegistrationStatus;
}) => {
  return api.put("/registration-requests/status/update", {
    user_id,
    status,
  });
};

export const listRegistrationRequestsApi = async () => {
  const response = await api.get("/registration-requests");
  return response.data;
};
