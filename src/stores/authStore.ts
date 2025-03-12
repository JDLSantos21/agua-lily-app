import { create } from "zustand";
import { isTokenExpired } from "@/utils/jwtUtils";
import { getCookie, setCookie, removeCookie } from "@/lib/clientCookie";

interface AuthState {
  token: string | null;
  role: string | null;
  name: string | null;
  user_id: number | null;
  isInitialized: boolean;
  login: (token: string, role: string, name: string, id: number) => void;
  logout: () => void;
  initializeAuth: () => void;
  getTokenFromStorage: () => string | null;
}

const isClient = typeof window !== "undefined";

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  role: null,
  name: null,
  user_id: null,
  isInitialized: false,
  login: (token, role, name, id) => {
    console.log("Token recibido en login:", token);
    if (isClient) {
      // Limpiar cualquier token antiguo antes de almacenar el nuevo
      removeCookie("token");
      removeCookie("role");
      removeCookie("name");
      removeCookie("user_id");

      // Almacenar la información en cookies (7 días de expiración)
      setCookie("token", token, 7);
      setCookie("role", role, 7);
      setCookie("name", name, 7);
      setCookie("user_id", id.toString(), 7);
    }
    set({ token, role, name, isInitialized: true, user_id: id });
    console.log("Estado actualizado después de login:", { token, role, name, user_id: id });
  },
  logout: () => {
    if (isClient) {
      // Eliminar cookies
      removeCookie("token");
      removeCookie("role");
      removeCookie("name");
      removeCookie("user_id");
    }
    set({ token: null, role: null, name: null, user_id: null, isInitialized: true });
    console.log("Sesión cerrada, estado limpiado");
  },
  initializeAuth: () => {
    if (isClient) {
      const token = getCookie("token");
      const role = getCookie("role");
      const name = getCookie("name");
      const user_id = getCookie("user_id");

      console.log("Inicializando autenticación, token encontrado:", token);

      if (token && !isTokenExpired(token)) {
        console.log("Token válido encontrado, actualizando estado");
        set({ token, role, name, user_id: user_id ? Number(user_id) : null, isInitialized: true });
      } else {
        console.log("Token no encontrado o expirado, limpiando estado y cookies");
        // Limpiar cookies si el token está presente pero expirado
        removeCookie("token");
        removeCookie("role");
        removeCookie("name");
        removeCookie("user_id");
        set({ token: null, role: null, name: null, user_id: null, isInitialized: true });
      }
    } else {
      set({ token: null, role: null, name: null, user_id: null, isInitialized: true });
    }
  },
  // Función para obtener el token directamente de las cookies
  getTokenFromStorage: () => {
    return isClient ? getCookie("token") : null;
  }
}));