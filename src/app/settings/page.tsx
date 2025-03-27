"use client";

// import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Switch } from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import UpdateChecker from "@/components/updateChecker";
import UpdateModal from "@/components/updateModal";

// Hooks simulados para tema y notificaciones
// const useTheme = () => {
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   return { isDarkMode, setIsDarkMode };
// };

// const useNotifications = () => {
//   const [notificationsEnabled, setNotificationsEnabled] = useState(true);
//   return { notificationsEnabled, setNotificationsEnabled };
// };

export default function Settings() {
  const router = useRouter();
  // const { isDarkMode, setIsDarkMode } = useTheme();
  // const { notificationsEnabled, setNotificationsEnabled } = useNotifications();

  const handleBack = () => {
    router.back();
  };

  return (
    <motion.div className="container mx-auto py-6 p-10">
      {/* Encabezado */}
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={handleBack} className="mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Configuración</h1>
      </div>

      {/* Contenido */}
      <div className="space-y-6">
        {/* Sección: Actualización de la Aplicación */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-2/5"
        >
          <Card>
            <CardHeader>
              <CardTitle>Actualización de la Aplicación</CardTitle>
              <CardDescription>
                Verifica y aplica actualizaciones para mantener la aplicación al
                día.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UpdateChecker />
              <UpdateModal />
            </CardContent>
          </Card>
        </motion.div>
        {/* 
        <Card>
          <CardHeader>
            <CardTitle>Tema</CardTitle>
            <CardDescription>
              Selecciona el tema de la aplicación.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isDarkMode ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
                <Label>{isDarkMode ? "Modo Oscuro" : "Modo Claro"}</Label>
              </div>
              <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notificaciones</CardTitle>
            <CardDescription>
              Administra tus preferencias de notificaciones.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <Label>Notificaciones habilitadas</Label>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cuenta de Usuario</CardTitle>
            <CardDescription>
              Administra tu información de cuenta y seguridad.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button variant="outline" className="w-full">
                <User className="h-5 w-5 mr-2" />
                Ver Perfil
              </Button>
              <Button variant="outline" className="w-full">
                Cambiar Contraseña
              </Button>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </motion.div>
  );
}
