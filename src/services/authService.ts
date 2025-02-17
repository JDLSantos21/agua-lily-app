// src/services/authService.ts
import { API_URL } from "@/api/config";
export const login = async (username: string, password: string) => {
  console.log(username, password);
  const response = await fetch(`${API_URL}/auth/login?api_key=1234`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    console.log(await response.json());
    throw new Error("Usuario o contraseña incorrecta.");
  }

  const data = await response.json();
  console.log(data);
  return data;
};
