// lib/serverFetcher.ts
import { API_URL } from "@/api/config";
import { cookies } from 'next/headers';

// Versión del fetcher para componentes de servidor que no accede a localStorage o APIs de navegador
export async function serverFetcher<T>(
  endpoint: string,
  options: RequestInit = {},
  params: Record<string, string | number | Date> = {},
  token?: string // Token opcional que se puede pasar directamente
): Promise<T> {
  try {
    // Convertir los parámetros en una cadena de consulta válida
    const url = new URL(`${API_URL}${endpoint}`);
    const searchParams = new URLSearchParams(params as Record<string, string>);

    // Añadir los parámetros a la URL 
    url.search = searchParams.toString();

    // Intentar obtener el token de las cookies del servidor
    const cookieStore = cookies();
    const tokenFromCookies = cookieStore.get('token')?.value;
    
    // Priorizar el token pasado como parámetro, luego el de las cookies
    const authToken = token || tokenFromCookies;

    // Configurar los headers con el token de autorización si está disponible
    const headers = new Headers(options.headers || {
      "Content-Type": "application/json",
    });
    
    if (authToken) {
      headers.set("Authorization", `Bearer ${authToken}`);
    }

    const response = await fetch(url.toString(), {
      ...options,
      headers,
      // Importante: La caché Next.js puede hacer que tus datos sean obsoletos
      // Esto asegura que siempre obtengamos datos frescos
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `Error en la petición al servidor: ${response.status} ${response.statusText}`
      );
    }

    return response.json() as Promise<T>;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error en serverFetcher:", error.message);
      throw new Error(error.message);
    } else {
      console.error("Error desconocido en serverFetcher");
      throw new Error("Ocurrió un problema, intente de nuevo más tarde.");
    }
  }
}