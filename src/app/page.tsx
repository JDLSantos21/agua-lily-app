"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Login from "@/components/Home/Login";
import { useAuthStore } from "@/stores/authStore";
import { LoaderSpin } from "@/components/Loader";

export default function Home() {
  const { isInitialized, token, role } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && token && role) {
      router.replace("/dashboard");
    }
  }, [isInitialized, token, role, router]);

  // Mientras no se haya inicializado, mostramos un loader
  if (!isInitialized || token) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderSpin text="Verificando" />
      </div>
    );
  }

  // Si se ha inicializado pero no hay token, mostramos el login
  return (
    <div className="flex probando items-center justify-center h-screen select-none">
      <Login />
    </div>
  );
}
