import { API_URL } from "./config";
import { useAuthStore } from "@/stores/authStore";

export const fetcher = async (
  endpoint: string,
  options: RequestInit = {},
  params: Record<string, string | number | Date> = {}
) => {
  // Convertir los parámetros en una cadena de consulta válida
  const url = new URL(`${API_URL}${endpoint}`);
  const searchParams = new URLSearchParams(params as Record<string, string>);

  // Añadir los parámetros a la URL
  url.search = searchParams.toString();

  // Obtener el token primero del store, y si no está disponible, directamente del localStorage
  // Esto ayuda cuando la página se refresca y el estado de Zustand aún no se ha inicializado
  const authState = useAuthStore.getState();
  let token = authState.token;

  // Si el token no está en el estado de Zustand, intentar obtenerlo del localStorage
  if (!token) {
    token = authState.getTokenFromStorage();

    // Si obtuvimos un token del localStorage, pero no está en el estado, inicializar el estado
    if (token && !authState.isInitialized) {
      authState.initializeAuth();
      // Actualizar token con el valor del estado después de inicializar
      token = useAuthStore.getState().token;
    }
  }

  // Configurar los encabezados
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  try {
    const response = await fetch(url.toString(), {
      ...options,
      headers,
    });

    if (!response.ok) {
      // Si es un error 401, verificar si el token ha expirado
      const errorData = await response.json();

      if (response.status === 401) {
        if (errorData.message === "NO_TOKEN_FOUND") {
          console.log("No se ha encontrando el token, cerrando sesión");
          useAuthStore.getState().logout();
          throw new Error(
            "Sesión expirada. Por favor, inicia sesión nuevamente."
          );
        }

        if (errorData.message === "TOKEN_EXPIRED") {
          console.log("Token expirado, cerrando sesión");
          useAuthStore.getState().logout();
          throw new Error(
            "Sesión expirada. Por favor, inicia sesión nuevamente."
          );
        }
      }

      if (response.status === 403) {
        if (errorData.message === "INVALID_TOKEN") {
          console.log("Token inválido, cerrando sesión");
          useAuthStore.getState().logout();
          throw new Error(
            "Sesión expirada. Por favor, inicia sesión nuevamente."
          );
        }
      }

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
