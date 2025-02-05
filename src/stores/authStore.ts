import { create } from "zustand";

interface AuthState {
  token: string | null;
  role: string | null;
  name: string | null;
  user_id: number | null;
  isInitialized: boolean; // Nuevo estado para indicar si la autenticación se ha inicializado
  login: (token: string, role: string, name: string, id: number) => void;
  logout: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  role: null,
  name: null,
  user_id: null,
  isInitialized: false, // Inicialmente, la autenticación no está inicializada
  login: (token, role, name, id) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("name", name);
    localStorage.setItem("user_id", id.toString());
    set({ token, role, name, isInitialized: true, user_id: id });
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    set({ token: null, role: null, isInitialized: true });
  },
  initializeAuth: () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");
    const id = localStorage.getItem("user_id");

    if (token) {
      set({ token, role, name, user_id: Number(id), isInitialized: true });
    } else {
      set({ isInitialized: true });
    }
  },
}));
