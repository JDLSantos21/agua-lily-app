import { API_URL } from "./config";

export const fetcher = async (
  endpoint: string,
  options = {},
  params: Record<string, string | number | Date> = {}
) => {
  // Convertir los parámetros en una cadena de consulta válida
  const url = new URL(`${API_URL}${endpoint}`);
  const searchParams = new URLSearchParams(params as Record<string, string>);

  // Agregar la API key siempre
  // searchParams.append("api_key", "1234");

  // Añadir los parámetros a la URL
  url.search = searchParams.toString();

  try {
    const response = await fetch(url.toString(), options);
    if (!response.ok) {
      const errorData = await response.json();
      console.log(errorData);
      throw new Error(
        errorData.message || "Ocurrió un problema, intente de nuevo más tarde."
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Ocurrió un problema, intente de nuevo más tarde.");
    }
  }
};
