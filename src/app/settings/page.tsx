"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { motion } from "framer-motion";
import UpdateChecker from "@/components/updateChecker";
import UpdateModal from "@/components/updateModal";

export default function Settings() {
  return (
    <motion.div className="container mx-auto py-6 p-10">
      {/* Encabezado */}
      <div className="flex flex-col mb-6">
        <h1 className="text-2xl font-bold">Configuraciones generales</h1>
        <p className="text-gray-600">
          Aquí puedes ajustar la configuración de la aplicación según tus
          preferencias.
        </p>
      </div>

      <div className="space-y-6">
        {/* Sección: Actualización de la Aplicación */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
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
      </div>
    </motion.div>
  );
}
