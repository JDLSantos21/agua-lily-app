"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGenerateAndPrintLabels,
  useSessionInfo,
  useTodayLabels,
} from "@/hooks/useLabels";
import TodayLabelsModal from "./today-labels-modal";
import SessionStatusIndicator from "./session-status-indicator";
import PrintMultipleModal from "./print-multiple-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { List, Printer, Loader2, AlertCircle, Hash, Tag } from "lucide-react";
import { toast } from "sonner";
import { printerService } from "@/services/printService";
import { Label } from "@/types/label.types";

const inputVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" },
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

export default function LabelsGenerateSection() {
  const [inputQty, setInputQty] = useState<number | null>(null);
  const [labelsModalOpen, setLabelsModalOpen] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<any>(null);
  const [printMultipleModalOpen, setPrintMultipleModalOpen] = useState(false);

  const labelInput = useRef<HTMLInputElement>(null);

  const { data: sessionInfo } = useSessionInfo();
  const {
    data: todayLabels,
    isLoading: labelsLoading,
    refetch: refetchLabels,
  } = useTodayLabels();
  const generateLabelMutation = useGenerateAndPrintLabels();

  const isFormValid = inputQty !== null && inputQty > 0 && inputQty <= 50;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "l") {
        event.preventDefault();
        labelInput.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleLabelsGeneration = () => {
    if (inputQty === null || inputQty <= 0) {
      toast.warning("Por favor ingrese una cantidad válida.");
      return;
    } else if (inputQty > 50) {
      toast.info("La cantidad máxima de etiquetas a generar es 50.");
      return;
    }

    if (sessionInfo?.is_closed) {
      toast.error(
        "La sesión del día está cerrada. No se pueden generar más etiquetas."
      );
      return;
    }

    generateLabelMutation.mutate({
      quantity: inputQty,
    });

    setInputQty(null);
  };

  const handleReprintLabel = async (label: Label, quantity = 1) => {
    try {
      setIsPrinting(true);
      const { sequence_number, created_at } = label;

      const labelData = {
        sequence_number,
        created_at,
        quantity,
      };

      await printerService.printBottleLabel(labelData);
      toast.success(`${quantity} etiqueta(s) reimpresa(s) correctamente`);

      if (quantity > 1) {
        setPrintMultipleModalOpen(false);
      }
    } catch (error) {
      console.error("Error al reimprimir etiqueta:", error);
      toast.error("Error al reimprimir la etiqueta");
    } finally {
      setIsPrinting(false);
    }
  };

  const openPrintMultipleModal = (label: Label) => {
    setSelectedLabel(label);
    setPrintMultipleModalOpen(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLabelsGeneration();
    }
  };

  const handleOpenLabelsModal = () => {
    refetchLabels();
    setLabelsModalOpen(true);
  };

  // const lastLabel = todayLabels?.[0];

  return (
    <motion.div
      className="relative p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
            <Tag className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">
            Generador de Etiquetas
          </h2>
        </div>
        <p className="text-slate-600">
          Imprime etiquetas para los botellones de agua.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="xl:col-span-2">
          <motion.div
            variants={inputVariants}
            initial="hidden"
            animate="visible"
            className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Hash className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Nueva Generación
                </h3>
                <p className="text-slate-600 text-sm">
                  Especifica la cantidad de etiquetas (máx. 50)
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-grow">
                <Input
                  ref={labelInput}
                  value={inputQty?.toString() || ""}
                  onChange={(e) => {
                    const value =
                      e.target.value === "" ? null : parseInt(e.target.value);
                    setInputQty(value);
                  }}
                  onKeyDown={handleKeyPress}
                  type="number"
                  min={1}
                  max={50}
                  placeholder="Cantidad"
                  className="h-12 border-2 border-slate-200 rounded-lg bg-white/80 backdrop-blur-sm hover:border-purple-300 focus:border-purple-500 transition-all duration-300 focus:ring-4 focus:ring-purple-100 text-center text-lg font-medium"
                  disabled={
                    generateLabelMutation.isPending || sessionInfo?.is_closed
                  }
                />
              </div>

              <motion.div
                variants={buttonVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  onClick={handleLabelsGeneration}
                  disabled={
                    generateLabelMutation.isPending ||
                    sessionInfo?.is_closed ||
                    !isFormValid
                  }
                  className={`
                    h-12 px-6 font-semibold rounded-lg transition-all duration-300
                    ${
                      isFormValid && !sessionInfo?.is_closed
                        ? "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg"
                        : "bg-slate-200 text-slate-500 cursor-not-allowed"
                    }
                  `}
                >
                  <AnimatePresence mode="wait">
                    {generateLabelMutation.isPending ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Generando...</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Printer className="h-4 w-4" />
                        <span>Generar</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xs text-slate-500 mt-3 text-center"
            >
              Presiona{" "}
              <kbd className="px-2 py-1 bg-slate-100 rounded text-xs font-mono">
                Ctrl + L
              </kbd>{" "}
              para enfocar
            </motion.p>
          </motion.div>
        </div>

        {/* Stats & Actions Sidebar */}
        <div className="space-y-4">
          {/* Session Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <SessionStatusIndicator sessionInfo={sessionInfo} />
          </motion.div>

          {/* Last Label Info */}
          {/* {lastLabel && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-xl p-4 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">
                    Última Etiqueta
                  </h4>
                  <p className="text-xs text-slate-600">Generada hoy</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Número:</span>
                  <span className="text-sm font-medium text-slate-800">
                    #{lastLabel.sequence_number}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Hora:</span>
                  <span className="text-sm font-medium text-slate-800">
                    {new Date(lastLabel.created_at).toLocaleTimeString(
                      "es-ES",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </span>
                </div>
              </div>
            </motion.div>
          )} */}

          {/* View Labels Button */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              variants={buttonVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                onClick={handleOpenLabelsModal}
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl shadow-lg transition-all duration-300"
              >
                <List className="h-4 w-4 mr-2" />
                <span className="font-medium">Ver Etiquetas del Día</span>
              </Button>
            </motion.div>
          </motion.div>

          {/* Total Labels Count
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-xl p-4 shadow-lg"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800 mb-1">
                {todayLabels?.length || 0}
              </div>
              <div className="text-sm text-slate-600">
                Etiquetas generadas hoy
              </div>
            </div>
          </motion.div> */}
        </div>
      </div>

      {/* Alert Section */}
      <AnimatePresence>
        {sessionInfo?.is_closed && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="mt-6"
          >
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200/60 rounded-xl p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-red-500 h-5 w-5 flex-shrink-0" />
                <div>
                  <h4 className="text-red-800 font-semibold">Sesión Cerrada</h4>
                  <p className="text-red-700 text-sm">
                    No se pueden generar más etiquetas. Contacta al
                    administrador.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <TodayLabelsModal
        isOpen={labelsModalOpen}
        onOpenChange={setLabelsModalOpen}
        labels={todayLabels}
        isLoading={labelsLoading}
        onRefresh={refetchLabels}
        onPrintOne={handleReprintLabel}
        onPrintMultiple={openPrintMultipleModal}
        isPrinting={isPrinting}
      />

      <PrintMultipleModal
        isOpen={printMultipleModalOpen}
        onOpenChange={setPrintMultipleModalOpen}
        onPrint={(quantity) =>
          selectedLabel && handleReprintLabel(selectedLabel, quantity)
        }
        isPrinting={isPrinting}
      />
    </motion.div>
  );
}
