import { create } from "zustand";
import { isTokenExpired } from "@/utils/jwtUtils";
import { getCookie } from "@/lib/clientCookie";
import { save, remove } from "@/utils/authCookies";
import { loginApi, logoutApi, refreshApi } from "@/services/authService";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  role: string | null;
  name: string | null;
  user_id: number | null;
  isInitialized: boolean;
  isRefreshing: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<boolean>;
  refresh: () => Promise<void>;
  initializeAuth: () => void;
  isAuthenticated: () => boolean;
}

const isClient = typeof window !== "undefined";

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  role: null,
  name: null,
  user_id: null,
  isInitialized: false,
  isRefreshing: false,

  isAuthenticated: () => {
    const state = get();
    return !!state.accessToken && !isTokenExpired(state.accessToken);
  },

  async login(username, password) {
    const { data } = await loginApi(username, password);

    if (isClient) {
      save("accessToken", data.access_token, 7);
      save("refreshToken", data.refresh_token, 7);
      save("role", data.role, 7);
      save("name", data.name, 7);
      save("user_id", data.id.toString(), 7);
    }

    set({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      role: data.role,
      name: data.name,
      user_id: data.id,
    });
  },
  async logout() {
    try {
      await logoutApi(get().refreshToken);
    } catch (error) {
      return false;
    }

    if (isClient) {
      remove("accessToken");
      remove("refreshToken");
      remove("role");
      remove("name");
      remove("user_id");
    }

    set({
      accessToken: null,
      refreshToken: null,
      role: null,
      name: null,
      user_id: null,
    });

    return true;
  },

  initializeAuth: () => {
    if (!isClient) {
      set({ isInitialized: true });
      return;
    }

    const accessToken = getCookie("accessToken");
    const refreshToken = getCookie("refreshToken");
    const role = getCookie("role");
    const name = getCookie("name");
    const user_id = getCookie("user_id");

    if (accessToken && !isTokenExpired(accessToken)) {
      set({
        accessToken,
        refreshToken,
        role,
        name,
        user_id: user_id ? Number(user_id) : null,
        isInitialized: true,
      });
    } else if (refreshToken) {
      set({
        accessToken,
        refreshToken,
        role,
        name,
        user_id: user_id ? Number(user_id) : null,
        isInitialized: true,
      });

      get()
        .refresh()
        .catch((refreshError) => {
          if (isClient) {
            remove("accessToken");
            remove("refreshToken");
            remove("role");
            remove("name");
            remove("user_id");
          }
          set({
            accessToken: null,
            refreshToken: null,
            role: null,
            name: null,
            user_id: null,
            isInitialized: true,
          });
        });
    } else {
      if (isClient) {
        remove("accessToken");
        remove("refreshToken");
        remove("role");
        remove("name");
        remove("user_id");
      }
      set({
        accessToken: null,
        refreshToken: null,
        role: null,
        name: null,
        user_id: null,
        isInitialized: true,
      });
    }
  },
  async refresh() {
    const state = get();
    if (state.isRefreshing) return;

    set({ isRefreshing: true });

    try {
      const rt = state.refreshToken;
      if (!rt) {
        window.location.href = "/login";
        return;
      }

      const { data } = await refreshApi(rt);

      if (isClient) {
        save("accessToken", data.access_token, 7);
        // También guardamos el nuevo refresh token si viene en la respuesta
        if (data.refresh_token) {
          save("refreshToken", data.refresh_token, 7);
        }
      }

      set({
        accessToken: data.access_token,
        refreshToken: data.refresh_token || state.refreshToken,
        isRefreshing: false,
        isInitialized: true,
      });
    } catch (error) {
      if (isClient) {
        remove("accessToken");
        remove("refreshToken");
        remove("role");
        remove("name");
        remove("user_id");
      }

      set({
        accessToken: null,
        refreshToken: null,
        role: null,
        name: null,
        user_id: null,
        isRefreshing: false,
        isInitialized: true,
      });

      // Redirigir al login cuando falle el refresh token
      if (isClient) {
        window.location.href = "/login";
      }

      throw error;
    }
  },
}));
