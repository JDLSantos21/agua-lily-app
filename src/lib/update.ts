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
    console.log("Error al buscar actualizaciones:", error);
    return null;
  }
}
export async function downloadUpdate(
  update: Update,
  onProgress: (progress: number) => void
): Promise<void> {
  let downloaded = 0;
  let contentLength: number | undefined = 0;

  await update.download((event) => {
    switch (event.event) {
      case "Started":
        contentLength = event.data.contentLength;
        console.log("Descarga iniciada:", contentLength);
        break;
      case "Progress":
        downloaded += event.data.chunkLength;
        if (contentLength) {
          const progress = (downloaded / contentLength) * 100;
          onProgress(progress); // Reporta el porcentaje al callback
        }
        break;
      case "Finished":
        console.log("Descarga completada");
        onProgress(100); // Asegura que el progreso llegue al 100%
        break;
    }
  });
}

export async function installUpdate(update: Update): Promise<void> {
  try {
    await update.install();
    alert("Instalación completada. Reinicia la aplicación.");
  } catch (error) {
    console.log("Error al instalar la actualización:", error);
    alert("Hubo un error al instalar la actualización.");
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
    console.log("Error al instalar la actualización:", error);
    alert("Hubo un error al instalar la actualización.");
  }
}
