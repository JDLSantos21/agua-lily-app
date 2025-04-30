"use client";
// import { Geist, Geist_Mono } from "next/font/google";
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
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });${geistSans.variable} ${geistMono.variable} antialiased

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const setUpdate = useUpdateStore((state) => state.setUpdate);

  const [queryClient] = useState(() => new QueryClient());

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
          Version 1.1.4
        </h1>
        <UpdateModal />
        <SocketProvider />
        <Toaster richColors />
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
