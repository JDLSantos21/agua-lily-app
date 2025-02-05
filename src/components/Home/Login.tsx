"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/authService";
import { useAuthStore } from "@/stores/authStore";

// Componentes UI
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Iconos de lucide-react
import { User, Lock, LogIn, Loader } from "lucide-react";
// Alertas con sonner
import { toast, Toaster } from "sonner";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { login: authLogin, token, role } = useAuthStore();

  const redirectBasedOnRole = useCallback(
    (role: string) => {
      console.log(role);
      router.replace("/dashboard");
    },
    [router]
  );

  useEffect(() => {
    if (token && role) {
      redirectBasedOnRole(role);
    }
  }, [token, role, redirectBasedOnRole]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { token, role, name, id } = await login(username, password);
      console.log(token, role, name, id);
      authLogin(token, role, name, id);
      redirectBasedOnRole(role);
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-20">
      <Toaster richColors />
      <CardHeader>
        <CardTitle>Bienvenido</CardTitle>
        <CardDescription>Inicia sesión en el sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="username">Usuario</Label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={18}
              />
              <Input
                id="username"
                type="text"
                placeholder="Ingresa tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                size={18}
              />
              <Input
                id="password"
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          <Button
            type="submit"
            variant={"primary"}
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <Loader className="animate-spin" size={18} />
            ) : (
              <>
                <LogIn className="mr-2" size={18} />
                Iniciar sesión
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
