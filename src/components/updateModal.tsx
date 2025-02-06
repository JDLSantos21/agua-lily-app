// src/components/UpdateModal.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useUpdateStore } from "@/stores/updateStore";
import { downloadAndInstallUpdate } from "@/lib/update";

export default function UpdateModal() {
  const { updateAvailable, updateInfo, clearUpdate } = useUpdateStore();

  const handleDownloadAndInstall = async () => {
    if (updateInfo) {
      // Se utiliza la propiedad raw, que es del tipo Update
      await downloadAndInstallUpdate(updateInfo.raw);
      clearUpdate();
    }
  };

  // Si no hay actualización, no renderizamos nada.
  if (!updateAvailable || !updateInfo) return null;

  return (
    <Dialog
      open={updateAvailable}
      onOpenChange={(open) => {
        if (!open) clearUpdate();
      }}
    >
      <DialogContent>
        <DialogTitle>Nueva Actualización Disponible</DialogTitle>
        <p>Versión: {updateInfo.version}</p>
        <p>Notas: {updateInfo.notes}</p>
        <Button onClick={handleDownloadAndInstall}>Descargar e Instalar</Button>
      </DialogContent>
    </Dialog>
  );
}
