import axios, { AxiosError } from "axios";
import { destroyCookie, parseCookies } from "nookies";
import { AuthTokenError } from "./errors/AuthTokenError";

export function setupAPIClient(ctx = undefined) {
  const cookies = parseCookies(ctx);

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      Authorization: `Bearer ${cookies["@websig.token"]}`,
    },
  });

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        if (typeof window !== "undefined") {
          // signOut();
          destroyCookie(undefined, "@websig.token");
          window.location.href = "/signin";
        } else {
          return Promise.reject(new AuthTokenError());
        }
      }
      return Promise.reject(error);
    }
  );
  return api;
}
