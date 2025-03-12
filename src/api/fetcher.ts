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
      if (response.status === 401) {
        const { logout } = useAuthStore.getState();
        console.log("Error 401 recibido:", response);
        
        // Verificar si tenemos un token en localStorage que pueda ser válido
        const storedToken = localStorage.getItem("token");
        if (!storedToken || isTokenExpired(storedToken)) {
          // Si no hay token o está expirado, cerrar sesión
          logout();
          throw new Error("Sesión expirada. Por favor, inicia sesión nuevamente.");
        } else {
          // Si hay un token válido pero recibimos 401, puede ser un problema de sincronización
          // Intentar reinicializar la autenticación antes de fallar
          useAuthStore.getState().initializeAuth();
          throw new Error("Error de autorización. Por favor, intenta nuevamente.");
        }
      }

      const errorData = await response.json();
      console.log("Error de respuesta:", errorData);
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

// Función auxiliar para verificar la expiración del token
function isTokenExpired(token: string): boolean {
  try {
    // Decodificar el token para obtener el payload
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    
    // Comprobar si el token ha expirado
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.error("Error verificando expiración del token:", error);
    return true; // Considerar expirado en caso de error
  }
}