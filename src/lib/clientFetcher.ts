// lib/clientFetcher.ts
"use client";
import { toast } from "sonner";
import { fetcher } from "@/api/fetcher";

export async function clientFetcher<T>(
  endpoint: string,
  options = {},
  params: Record<string, string | number | Date> = {}
): Promise<T> {
  try {
    const response = await fetcher(endpoint, options, params);
    return response;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error desconocido en el servidor";
    toast.error(errorMessage); // Muestra una notificación en la UI
    throw error; // Relanza el error para que el componente pueda manejarlo si es necesario
  }
}
