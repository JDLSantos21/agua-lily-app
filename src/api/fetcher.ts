import { API_URL } from "./config";

export const fetcher = async (
  endpoint: string,
  options = {},
  params: Record<string, string | number | undefined> = {}
) => {
  // Convertir los parámetros en una cadena de consulta válida
  const url = new URL(`${API_URL}${endpoint}`);
  const searchParams = new URLSearchParams(params as Record<string, string>);

  // Agregar la API key siempre
  searchParams.append("api_key", "1234");

  // Añadir los parámetros a la URL
  url.search = searchParams.toString();

  const response = await fetch(url.toString(), options);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error en la petición");
  }

  return response.json();
};
