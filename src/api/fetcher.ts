// src/api/fetcher.ts
import { API_URL } from "./config";

export const fetcher = async (endpoint: string, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, options);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error en la petición");
  }

  return response.json();
};
