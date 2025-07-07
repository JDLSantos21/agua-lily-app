"use client";

import "./globals.css";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { Toaster } from "sonner";
import { SocketProvider } from "@/components/SocketProvider";
import { useInactivityLogout } from "@/hooks/useInactivityLogout";
import { checkForUpdates } from "@/lib/update";
import UpdateModal from "@/components/updateModal";
import { useUpdateStore } from "@/stores/updateStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const setUpdate = useUpdateStore((state) => state.setUpdate);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Configuración optimizada para mejorar rendimiento
            staleTime: 1000 * 60, // 1 minuto por defecto
            retry: 1, // Solo reintentar una vez si falla
            refetchOnWindowFocus: false, // No recargar automáticamente al cambiar el foco
            refetchOnMount: true, // Recargar datos cuando el componente se monta
          },
          mutations: {
            retry: 0, // No reintentar mutaciones
          },
        },
      })
  );

  useInactivityLogout();

  useEffect(() => {
    initializeAuth();
    checkForUpdates().then((update) => {
      if (update) {
        setUpdate(update);
      }
    });
  }, [initializeAuth, setUpdate]);

  return (
    <html lang="en">
      <body>
        <h1 className="absolute top-0 right-2 text-sm text-gray-800/40">
          Version 1.2.5
        </h1>
        <UpdateModal />
        <QueryClientProvider client={queryClient}>
          <SocketProvider />
          <Toaster richColors />
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
