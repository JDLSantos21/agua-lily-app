"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/authService";
import { useAuthStore } from "@/stores/authStore";
import { motion } from "framer-motion";

// Componentes UI
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { User, Lock, Loader, ArrowRight } from "lucide-react";
import { toast } from "sonner";

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
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {/* Reemplaza la URL con la ruta a tu logo */}
            <img
              src="/logo.png"
              alt="Logo de la empresa"
              width={120}
              height={60}
              className="h-16 w-auto"
            />
          </motion.div>
        </div>

        <Card className="w-full shadow-lg border-0 overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
          <CardHeader className="space-y-1 pb-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <CardTitle className="text-2xl font-bold text-center">
                Bienvenido
              </CardTitle>
              <CardDescription className="text-center pt-1">
                Inicia sesión para acceder al sistema
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="space-y-2"
              >
                <Label htmlFor="username" className="text-sm font-medium">
                  Usuario
                </Label>
                <div className="relative group">
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200"
                    size={18}
                  />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Ingresa tu usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="space-y-2"
              >
                <Label htmlFor="password" className="text-sm font-medium">
                  Contraseña
                </Label>
                <div className="relative group">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200"
                    size={18}
                  />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="pt-2"
              >
                <Button
                  type="submit"
                  variant="default"
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all duration-300 font-medium"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader className="animate-spin" size={20} />
                  ) : (
                    <motion.div
                      className="flex items-center justify-center w-full"
                      whileHover={{ x: 5 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      Iniciar sesión
                      <ArrowRight className="ml-2" size={18} />
                    </motion.div>
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center pb-6 pt-2">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              className="text-xs text-gray-500 text-center"
            >
              © 2025 Agua & Hielo Lily S.R.L. Todos los derechos reservados.{" "}
              <br />
              Desarrollado por{" "}
              <a
                href="https://github.com/JDLSantos21/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Jose A. De Los Santos
              </a>
            </motion.p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
