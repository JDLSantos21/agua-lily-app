import { AxiosError } from "axios";

// Tipos para las respuestas de error comunes
interface ErrorResponse {
  message?: string;
  error?: string;
  details?: string;
}

// Función helper para verificar si el error es de Axios
export const isAxiosError = (error: unknown): error is AxiosError => {
  return error !== null && typeof error === "object" && "isAxiosError" in error;
};

// Función helper para extraer el mensaje de error
export const getErrorMessage = (
  error: unknown,
  fallbackMessage = "Error desconocido"
): string => {
  if (isAxiosError(error)) {
    // Verificar si hay un mensaje específico en la respuesta
    if (error.response?.data) {
      const data = error.response.data as ErrorResponse;

      // Verificar diferentes estructuras de respuesta de error
      if (typeof data === "string") return data;
      if (data.message && typeof data.message === "string") return data.message;
      if (data.error && typeof data.error === "string") return data.error;
      if (data.details && typeof data.details === "string") return data.details;
    }

    // Si no hay mensaje específico, usar el mensaje del error HTTP
    return error.message || `Error ${error.response?.status || "HTTP"}`;
  }

  // Si no es un AxiosError, intentar extraer el mensaje
  if (error instanceof Error) {
    return error.message;
  }

  // Fallback para errores desconocidos
  return fallbackMessage;
};

// Función para obtener el código de estado HTTP si está disponible
export const getErrorStatusCode = (error: unknown): number | null => {
  if (isAxiosError(error)) {
    return error.response?.status || null;
  }
  return null;
};

// Función para manejar errores de forma consistente
export const handleApiError = (error: unknown, context?: string): string => {
  const message = getErrorMessage(error);
  const statusCode = getErrorStatusCode(error);

  // Log del error para debugging
  console.error(`${context ? `[${context}] ` : ""}Error:`, {
    message,
    statusCode,
    error,
  });

  // Devolver mensaje apropiado basado en el código de estado
  switch (statusCode) {
    case 401:
      return "No tienes autorización para realizar esta acción";
    case 403:
      return "No tienes permisos para realizar esta acción";
    case 404:
      return "El recurso solicitado no fue encontrado";
    case 422:
      return message || "Los datos enviados no son válidos";
    case 500:
      return "Error interno del servidor. Intenta de nuevo más tarde";
    default:
      return message;
  }
};

// Hook personalizado para manejar errores en mutaciones
export const useErrorHandler = () => {
  return {
    handleError: (error: unknown, context?: string) =>
      handleApiError(error, context),
    getErrorMessage: (error: unknown, fallback?: string) =>
      getErrorMessage(error, fallback),
    getStatusCode: (error: unknown) => getErrorStatusCode(error),
    isAxiosError: (error: unknown) => isAxiosError(error),
  };
};
