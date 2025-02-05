"use client";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { LoaderSpin } from "@/components/Loader";

export default function AccessDenied() {
  const { isInitialized, logout, name } = useAuthStore();
  const router = useRouter();

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderSpin text="Cargando" />
      </div>
    );
  }

  const handleBack = () => {
    router.replace("/dashboard");
  };

  const handleLogout = () => {
    router.replace("/");
    logout();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Acceso denegado</h1>
      <p className="text-gray-600">
        {name} No tienes permiso para acceder a esta sección.
      </p>
      <button
        onClick={handleBack}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Volver al dashboard
      </button>
      <button onClick={() => handleLogout()} className="text-red-500/80 mt-2">
        Salir
      </button>
    </div>
  );
}
