import { motion } from "framer-motion";
import { History, Power, PowerOff } from "lucide-react";

interface SessionStatusIndicatorProps {
  sessionInfo: any;
}

export default function SessionStatusIndicator({
  sessionInfo,
}: SessionStatusIndicatorProps) {
  if (!sessionInfo) return null;

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Session Status Badge */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
        className="relative group"
      >
        <div
          className={`
          absolute inset-0 rounded-2xl transition-all duration-300
          ${
            sessionInfo.is_closed
              ? "bg-gradient-to-br from-red-100/60 to-orange-100/60"
              : "bg-gradient-to-br from-green-100/60 to-emerald-100/60"
          }
        `}
        ></div>

        <div
          className={`
          relative bg-white/90 backdrop-blur-sm border rounded-2xl p-4 shadow-lg transition-all duration-300 group-hover:shadow-xl
          ${sessionInfo.is_closed ? "border-red-200/50" : "border-green-200/50"}
        `}
        >
          <div className="flex items-center gap-3">
            <div
              className={`
              p-3 rounded-xl transition-colors duration-300
              ${
                sessionInfo.is_closed
                  ? "bg-red-100 group-hover:bg-red-200"
                  : "bg-green-100 group-hover:bg-green-200"
              }
            `}
            >
              {sessionInfo.is_closed ? (
                <PowerOff className="w-5 h-5 text-red-600" />
              ) : (
                <Power className="w-5 h-5 text-green-600" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`
                  w-2 h-2 rounded-full animate-pulse
                  ${sessionInfo.is_closed ? "bg-red-500" : "bg-green-500"}
                `}
                ></span>
                <h3
                  className={`
                  font-semibold text-sm
                  ${sessionInfo.is_closed ? "text-red-800" : "text-green-800"}
                `}
                >
                  {sessionInfo.is_closed ? "Sesión Cerrada" : "Sesión Activa"}
                </h3>
              </div>
              <p
                className={`
                text-xs
                ${sessionInfo.is_closed ? "text-red-600" : "text-green-600"}
              `}
              >
                {sessionInfo.is_closed
                  ? "No se pueden generar etiquetas"
                  : "Sistema operativo"}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Label Counter Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative group"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/60 to-indigo-100/60 rounded-2xl"></div>

        <div className="relative bg-white/90 backdrop-blur-sm border border-blue-200/50 rounded-2xl p-6 shadow-lg transition-all duration-300 group-hover:shadow-xl">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors duration-300">
              <History className="w-6 h-6 text-blue-600" />
            </div>

            <div className="flex-1">
              {sessionInfo.is_active ? (
                <>
                  <h4 className="text-blue-800 font-semibold text-sm mb-2">
                    Última Etiqueta Generada
                  </h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-blue-900 tracking-tight">
                      {sessionInfo.current_counter.toString().padStart(3, "0")}
                    </span>
                    <span className="text-blue-600 text-sm font-medium">
                      #{sessionInfo.current_counter}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-blue-600 text-xs">
                      Contador actualizado
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <h4 className="text-blue-700 font-semibold text-sm mb-2">
                    Sesión No Iniciada
                  </h4>
                  <p className="text-blue-600 text-sm mb-3">
                    Genera tu primera etiqueta para iniciar el contador del día
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-blue-500 text-xs">
                      Esperando primera etiqueta
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
