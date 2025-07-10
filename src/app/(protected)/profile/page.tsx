"use client";

import { useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { Mail, Shield, Clock, Key, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ProfilePage() {
  const { name, role } = useAuthStore();

  // Estados para manejo de formularios
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Función para cambiar contraseña
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();

    // Resetear estados
    setPasswordError("");
    setPasswordSuccess(false);

    // Validaciones
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Todos los campos son obligatorios");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Las contraseñas nuevas no coinciden");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    // Aquí iría la lógica para cambiar la contraseña en el servidor
    // Por ahora, simulamos éxito
    setTimeout(() => {
      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 1000);
  };

  // Formatear la fecha del último login
  // const formatLastLogin = (dateString?: string) => {
  //   if (!dateString) return "Desconocido";

  //   const date = new Date(dateString);
  //   return new Intl.DateTimeFormat("es-ES", {
  //     day: "2-digit",
  //     month: "2-digit",
  //     year: "numeric",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   }).format(date);
  // };

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-2xl font-medium mb-6">Perfil de Usuario</h1>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="info" className="rounded-md">
            Información
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-md">
            Seguridad
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tarjeta de perfil */}
            <Card className="md:col-span-1">
              <CardHeader className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-2">
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                    {name?.[0]}
                  </AvatarFallback>
                  <AvatarImage src="" alt={name || "Usuario"} />
                </Avatar>
                <CardTitle className="mt-2">{name}</CardTitle>
                <CardDescription>{role}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-600">Email@email.com</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Shield className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-600">{role || "Usuario"}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-600">
                      Último acceso: 2023-10-01 14:30
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información personal */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Información Personal</CardTitle>
                <CardDescription>
                  Revisa y actualiza tu información personal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nombre completo</Label>
                    <Input
                      id="fullName"
                      defaultValue={name || "Nombre Apellido"}
                      className="bg-gray-50"
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                      id="email"
                      defaultValue={"email@email.com"}
                      className="bg-gray-50"
                      disabled
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Rol en el sistema</Label>
                    <Input
                      id="role"
                      defaultValue={role || "Usuario"}
                      className="bg-gray-50"
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Departamento</Label>
                    <Input
                      id="department"
                      defaultValue="Administración"
                      className="bg-gray-50"
                      disabled
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-gray-500">
                  Para actualizar esta información, contacta al administrador
                  del sistema
                </p>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cambiar contraseña</CardTitle>
              <CardDescription>
                Actualiza tu contraseña para mantener segura tu cuenta
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleChangePassword}>
              <CardContent className="space-y-4">
                {passwordError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{passwordError}</AlertDescription>
                  </Alert>
                )}

                {passwordSuccess && (
                  <Alert className="bg-green-50 border-green-200">
                    <Check className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">Éxito</AlertTitle>
                    <AlertDescription className="text-green-700">
                      La contraseña se ha actualizado correctamente
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Contraseña actual</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nueva contraseña</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    La contraseña debe tener al menos 8 caracteres
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    Confirmar nueva contraseña
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </CardContent>

              <CardFooter>
                <Button type="submit" className="ml-auto">
                  <Key className="h-4 w-4 mr-2" />
                  Actualizar contraseña
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
