// src/components/UpdateModal.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useUpdateStore } from "@/stores/updateStore";
import { downloadUpdate, installUpdate } from "@/lib/update";
import { Progress } from "@/components/ui/progress";
import { Download, MonitorCog } from "lucide-react";
import { motion } from "framer-motion";

export default function UpdateModal() {
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const { updateAvailable, updateInfo, clearUpdate } = useUpdateStore();

  const handleDownload = async () => {
    if (updateInfo) {
      await downloadUpdate(updateInfo.raw, (progress) => {
        setDownloadProgress(progress);
      });
    }
  };

  const handleInstall = async () => {
    if (updateInfo) {
      await installUpdate(updateInfo.raw);
      clearUpdate();
    }
  };

  if (!updateAvailable || !updateInfo) return null;

  return (
    <Dialog open={updateAvailable} onOpenChange={clearUpdate}>
      <DialogContent className="max-w-md p-6 bg-white rounded-lg shadow-lg">
        <DialogTitle className="text-xl font-semibold text-gray-800">
          Actualización Disponible
        </DialogTitle>
        <DialogDescription className="text-sm text-gray-600">
          Hay una nueva actualización disponible para tu aplicación.
        </DialogDescription>
        <div className="space-y-2 mb-4">
          <p className="text-sm font-medium text-gray-700">
            Versión:{" "}
            <span className="font-normal text-green-600">
              {updateInfo.version}
            </span>
          </p>
          <p className="text-sm font-medium text-gray-700">
            <span className="font-normal">{updateInfo.notes}</span>
          </p>
        </div>
        {downloadProgress > 0 && downloadProgress < 100 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mb-4"
          >
            <Progress value={downloadProgress} className="w-full" />
          </motion.div>
        )}
        {downloadProgress === 100 && (
          <div className="flex items-center justify-center mb-4">
            <span className="text-green-500 text-center">
              Se descargó la actualización, instalala ahora.
            </span>
          </div>
        )}
        <div className="flex justify-end space-x-2">
          {downloadProgress < 100 ? (
            <Button
              variant="primary"
              onClick={handleDownload}
              disabled={downloadProgress > 0 && downloadProgress < 100}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="h-5 w-5" />
              Descargar
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleInstall}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
            >
              <MonitorCog className="h-5 w-5" />
              Instalar
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
