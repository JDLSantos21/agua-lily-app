// src/lib/update.ts
import { check, Update } from "@tauri-apps/plugin-updater";

/**
 * Definimos un tipo personalizado para la información de actualización
 * que usará la UI.
 */
export interface UpdateInfo {
  raw: Update; // El objeto original que provee Tauri
  version: string;
  date: string;
  notes: string;
}

/**
 * Verifica si hay una actualización disponible.
 * Si la hay, retorna un objeto UpdateInfo; de lo contrario, retorna null.
 */
export async function checkForUpdates(): Promise<UpdateInfo | null> {
  try {
    const update: Update | null = await check();
    if (update) {
      return {
        raw: update,
        version: update.version,
        date: update.date ?? "Fecha desconocida",
        notes: update.body ?? "No hay notas disponibles",
      };
    }
    return null;
  } catch (error) {
    console.error("Error al buscar actualizaciones:", error);
    return null;
  }
}

/**
 * Descarga e instala la actualización.
 * Recibe el objeto original Update (almacenado en raw).
 */
export async function downloadAndInstallUpdate(update: Update): Promise<void> {
  try {
    await update.downloadAndInstall();
    alert("Actualización completada. Reinicia la aplicación.");
  } catch (error) {
    console.error("Error al instalar la actualización:", error);
    alert("Hubo un error al instalar la actualización.");
  }
}
