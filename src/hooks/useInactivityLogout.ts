import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

const INACTIVITY_TIMEOUT = 180 * 60 * 1000; // 3 horas en milisegundos

export const useInactivityLogout = () => {
  const { logout } = useAuthStore();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        logout();
      }, INACTIVITY_TIMEOUT);
    };

    const events = ["mousemove", "keydown", "click", "scroll"];
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer(); // Inicia el temporizador

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
      clearTimeout(timer);
    };
  }, [logout]);
};
