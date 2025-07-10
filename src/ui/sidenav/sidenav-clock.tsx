"use client";
import { useState, useEffect } from "react";

export default function SidenavClock() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      const formattedDate = now.toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });

      // Capitalizar primera letra
      const capitalizedDate =
        formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

      setTime(formattedTime);
      setDate(capitalizedDate);
    };

    updateClock(); // Inicializar inmediatamente
    const intervalId = setInterval(updateClock, 30000); // Actualizar cada 30 segundos para optimización

    return () => clearInterval(intervalId); // Limpiar al desmontar
  }, []);

  return (
    <div className="flex flex-col text-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-100/50 shadow-sm">
      <span className="text-lg font-bold text-slate-800 mb-1">{time}</span>
      <span className="text-xs text-slate-600 font-medium">{date}</span>
    </div>
  );
}
