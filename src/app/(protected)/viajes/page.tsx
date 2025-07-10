"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Truck, MapPin, Plus, CheckCircle, Keyboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import TripCompleteForm from "./components/trip-complete-form";
import TripRecordForm from "./components/trip-record-form";
import LabelGenerator from "./components/label-components/label-generator";
import { useGetTripDefaults } from "@/shared/hooks/useTrips";
import TripPageSkeleton from "./components/trips-page-skeleton";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
      ease: "easeOut",
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const buttonVariants = {
  idle: { scale: 1, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" },
  hover: {
    scale: 1.02,
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.2 },
  },
  tap: { scale: 0.98 },
};

export default function Viaje() {
  const { isLoading } = useGetTripDefaults();
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "r") {
        event.preventDefault();
        setRegisterModalOpen(true);
      }
      if (event.ctrlKey && event.key === "c") {
        event.preventDefault();
        setCompleteModalOpen(true);
      }
      if (event.key === "Escape") {
        setRegisterModalOpen(false);
        setCompleteModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (isLoading) {
    return <TripPageSkeleton />;
  }

  return (
    <div className="min-h-screen py-6">
      <div className="">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          <motion.div variants={cardVariants} className="text-center">
            {/* Keyboard shortcuts hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-6 text-sm text-gray-500"
            >
              <div className="flex items-center gap-2">
                <Keyboard className="w-4 h-4" />
                <span>Atajos:</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">
                  Ctrl + R
                </kbd>
                <span>Registrar</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">
                  Ctrl + C
                </kbd>
                <span>Completar</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Action Cards - Horizontal Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Register Trip Button */}
            <motion.div variants={cardVariants} className="group">
              <motion.div
                initial="idle"
                whileHover="hover"
                whileTap="tap"
                className="rounded-2xl"
              >
                <Button
                  onClick={() => setRegisterModalOpen(true)}
                  className="w-full h-auto bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl shadow-xl transition-all duration-300 group-hover:shadow-2xl"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Plus className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-bold">Registrar Viaje</h3>
                      <p className="text-green-100 text-sm">
                        Inicia un nuevo viaje
                      </p>
                      <p className="text-green-200 text-xs mt-1">Ctrl + R</p>
                    </div>
                  </div>
                </Button>
              </motion.div>
            </motion.div>

            {/* Complete Trip Button */}
            <motion.div variants={cardVariants} className="group">
              <motion.div
                variants={buttonVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
                className="rounded-2xl"
              >
                <Button
                  onClick={() => setCompleteModalOpen(true)}
                  className="w-full h-auto bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-2xl shadow-xl transition-all duration-300 group-hover:shadow-2xl"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-4 bg-white/20 rounded-xl backdrop-blur-sm">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-xl font-bold">Completar Viaje</h3>
                      <p className="text-blue-100 text-sm">
                        Finaliza un viaje existente
                      </p>
                      <p className="text-blue-200 text-xs mt-1">Ctrl + C</p>
                    </div>
                  </div>
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Label Generator Section */}
          <motion.div
            variants={cardVariants}
            className="group relative overflow-hidden"
          >
            <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl rounded-2xl transition-all duration-300 group-hover:shadow-2xl">
              <LabelGenerator />
            </div>
          </motion.div>
        </motion.div>

        {/* Register Trip Modal */}
        <Dialog open={registerModalOpen} onOpenChange={setRegisterModalOpen}>
          <DialogContent className="max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-2xl">
            <DialogHeader className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Truck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-gray-900">
                    Registrar Viaje
                  </DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Inicia un nuevo viaje seleccionando el vehículo y conductor
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="mt-6">
              <TripRecordForm onSuccess={() => setRegisterModalOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>

        {/* Complete Trip Modal */}
        <Dialog open={completeModalOpen} onOpenChange={setCompleteModalOpen}>
          <DialogContent className="min-w-[1000px] bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-2xl">
            <DialogHeader className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-gray-900">
                    Completar Viaje
                  </DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Busca el viaje pendiente y completa la información requerida
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="mt-6">
              <TripCompleteForm onSuccess={() => setCompleteModalOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
