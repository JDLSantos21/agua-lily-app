import { Info } from "lucide-react";

interface SessionStatusIndicatorProps {
  sessionInfo: any;
}

export default function SessionStatusIndicator({
  sessionInfo,
}: SessionStatusIndicatorProps) {
  if (!sessionInfo) return null;

  return (
    <>
      {/* Indicador de estado de sesión */}
      <div
        className={`flex items-center justify-center w-36 gap-2 px-3 py-1 rounded-full text-sm ${
          sessionInfo.is_closed
            ? "bg-red-50 text-red-600 border border-red-200"
            : "bg-green-50 text-green-600 border border-green-200"
        }`}
      >
        <span
          className={`w-2 h-2 rounded-full ${
            sessionInfo.is_closed ? "bg-red-500" : "bg-green-500"
          }`}
        ></span>
        <span>
          {sessionInfo.is_closed ? "Sesión cerrada" : "Sesión activa"}
        </span>
      </div>

      {/* Contador de última etiqueta */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-center gap-3 min-w-56">
        <div className="bg-blue-500 text-white p-2 rounded-full">
          <Info size={20} />
        </div>
        <div>
          {sessionInfo.is_active ? (
            <>
              <p className="text-blue-700 text-sm font-medium">
                Última Etiqueta
              </p>
              <p className="text-blue-900 text-2xl font-bold">
                {sessionInfo.current_counter.toString().padStart(3, "0")}
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-blue-700">Sesión aun no iniciada</p>
              <p className="text-sm text-blue-700">
                Genera etiqueta para iniciar
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
