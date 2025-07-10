import { Button } from "@/components/ui/button";
import {
  Printer,
  Plus,
  Loader2,
  Package,
  RefreshCw,
  Clock,
  Hash,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface TodayLabelsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  labels: any[] | undefined;
  isLoading: boolean;
  onRefresh: () => void;
  onPrintOne: (label: any, quantity: number) => Promise<void>;
  onPrintMultiple: (label: any) => void;
  isPrinting: boolean;
}

export default function TodayLabelsModal({
  isOpen,
  onOpenChange,
  labels,
  isLoading,
  onRefresh,
  onPrintOne,
  onPrintMultiple,
  isPrinting,
}: TodayLabelsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-2xl">
        <DialogHeader className="pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-slate-800">
                Etiquetas del Día
              </DialogTitle>
              <DialogDescription className="text-slate-600">
                Gestiona y reimprime las etiquetas generadas hoy
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-sm text-slate-600">
                Total:{" "}
                <span className="font-semibold text-slate-800">
                  {labels?.length || 0}
                </span>{" "}
                etiquetas
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 border-slate-200 hover:bg-slate-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              <span>Actualizar</span>
            </Button>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center items-center h-64"
              >
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-3" />
                  <p className="text-slate-600">Cargando etiquetas...</p>
                </div>
              </motion.div>
            ) : !labels || labels.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center p-8 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200"
              >
                <Package className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  No hay etiquetas generadas
                </h3>
                <p className="text-slate-600">
                  Aún no se han generado etiquetas el día de hoy
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-2">
                  {labels.map((label, index) => (
                    <motion.div
                      key={label.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg">
                            <Hash className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-slate-800">
                                #{label.sequence_number}
                              </span>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  label.status === "printed"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {label.status === "printed"
                                  ? "Impresa"
                                  : "Generada"}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-600">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {format(new Date(label.created_at), "hh:mm a")}
                              </div>
                              <div className="flex items-center gap-1">
                                <Package className="h-4 w-4" />
                                {label.quantity}{" "}
                                {label.quantity === 1
                                  ? "etiqueta"
                                  : "etiquetas"}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPrintOne(label, 1)}
                            disabled={isPrinting}
                            className="flex items-center gap-2 border-slate-200 hover:bg-slate-50"
                          >
                            <Printer className="h-4 w-4" />
                            <span>Reimprimir</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onPrintMultiple(label)}
                            disabled={isPrinting}
                            className="flex items-center gap-2 border-slate-200 hover:bg-slate-50"
                          >
                            <Plus className="h-4 w-4" />
                            <Printer className="h-4 w-4" />
                            <span>Múltiples</span>
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
