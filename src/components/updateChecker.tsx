// src/components/UpdateChecker.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUpdateStore } from "@/stores/updateStore";
import { checkForUpdates } from "@/lib/update";

export default function UpdateChecker() {
  const [checking, setChecking] = useState(false);
  const setUpdate = useUpdateStore((state) => state.setUpdate);

  const handleCheckUpdate = async () => {
    setChecking(true);
    const update = await checkForUpdates();
    setChecking(false);

    if (update) {
      setUpdate(update); // Se actualiza el store y se activa el modal
    } else {
      alert("No hay actualizaciones disponibles.");
    }
  };

  return (
    <Button onClick={handleCheckUpdate} disabled={checking}>
      {checking ? "Buscando..." : "Buscar actualización"}
    </Button>
  );
}
