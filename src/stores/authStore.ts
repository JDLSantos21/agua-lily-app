import { create } from "zustand";
import { isTokenExpired } from "@/utils/jwtUtils";
import { getCookie } from "@/lib/clientCookie";
import { removeCookies, getCookies, setCookies } from "@/utils/authCookies";

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

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  role: null,
  name: null,
  user_id: null,
  isInitialized: false,
  login: (token, role, name, id) => {
    console.log("Token recibido en login:", token);
    // Limpiar cualquier token antiguo antes de almacenar el nuevo
    removeCookies();
    // Almacenar la información en cookies (7 días de expiración)
    setCookies(token, role, name, id, 7);
    set({ token, role, name, isInitialized: true, user_id: id });
  },
  logout: () => {
    // Eliminar cookies
    removeCookies();

    set({
      token: null,
      role: null,
      name: null,
      user_id: null,
      isInitialized: true,
    });
    console.log("Sesión cerrada, estado limpiado");
  },
  initializeAuth: () => {
    const { token, role, name, user_id } = getCookies();

    console.log("Inicializando autenticación, token encontrado:", token);

    if (token && !isTokenExpired(token)) {
      // console.log("Token válido encontrado, actualizando estado");
      set({
        token,
        role,
        name,
        user_id: user_id ? Number(user_id) : null,
        isInitialized: true,
      });
    } else {
      console.log("Token no encontrado o expirado, limpiando estado y cookies");
      // Limpiar cookies si el token está presente pero expirado
      removeCookies();

      set({
        token: null,
        role: null,
        name: null,
        user_id: null,
        isInitialized: true,
      });
    }
  },
  // Función para obtener el token directamente de las cookies
  getTokenFromStorage: () => {
    return getCookie("token") || null;
  },
}));
