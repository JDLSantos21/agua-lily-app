import { api } from "./api";

export async function loginApi(username: string, password: string) {
  return await api.post("/auth/login", {
    username,
    password,
  });
}

export async function logoutApi(refreshToken: string | null) {
  if (!refreshToken) return;
  return await api.post("/auth/logout", { refresh_token: refreshToken });
}

export const refreshApi = (refreshToken: string) =>
  api.post("/auth/refresh", { refresh_token: refreshToken });
