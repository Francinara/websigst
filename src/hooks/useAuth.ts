import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

export default function useAuth() {
  const { initializeAuth, ...authStore } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return authStore;
}
