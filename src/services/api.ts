import { API_URL } from "@/api/config";
import { useAuthStore } from "@/stores/authStore";
import axios, { AxiosError } from "axios";

type InvalidTokenResponse = {
  message: "TOKEN_EXPIRED" | "TOKEN_INVALID" | "NOT_TOKEN_FOUND";
  success: false;
};

const TIMEOUT_IN_MS = 10000;

export const api = axios.create({
  baseURL: API_URL,
  timeout: TIMEOUT_IN_MS,
});

// Inyectar el token desde el store
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshPromise: Promise<string> | null = null;

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const original = error.config as any;
    const responseErr = error.response;

    if (
      responseErr?.status === 401 &&
      typeof responseErr === "object" &&
      responseErr.data !== null &&
      (responseErr.data as InvalidTokenResponse).message === "TOKEN_EXPIRED" &&
      !original._retry
    ) {
      original._retry = true;

      if (!refreshPromise) {
        refreshPromise = useAuthStore
          .getState()
          .refresh()
          .then(() => useAuthStore.getState().accessToken as string)
          .finally(() => {
            refreshPromise = null;
          });
      }

      return refreshPromise.then((newToken) => {
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      });
    }

    return Promise.reject(error);
  }
);
