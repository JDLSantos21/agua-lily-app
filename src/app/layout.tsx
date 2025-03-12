"use client";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { Toaster } from "sonner";
import { SocketProvider } from "@/components/SocketProvider";
import { useInactivityLogout } from "@/hooks/useInactivityLogout";

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

  useInactivityLogout()


  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);
  
  return (
    <html lang="en">
      <body>
        <SocketProvider />
        <Toaster richColors />
        {children}
      </body>
    </html>
  );
}
