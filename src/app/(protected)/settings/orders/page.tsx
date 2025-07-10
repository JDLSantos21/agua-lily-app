"use client";
import { availableMonitors, Monitor } from "@tauri-apps/api/window";
import { useEffect, useState } from "react";
import MonitorSelector from "./components/monitor-selector";

export default function OrdersSettingsPage() {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  useEffect(() => {
    const fetchMonitors = async () => {
      try {
        const available = await availableMonitors();
        setMonitors(available);
      } catch (error) {
        console.error("Error fetching monitors:", error);
      }
    };

    fetchMonitors();
  }, []);

  return (
    <main className="flex flex-col items-start h-screen">
      <div className="text-2xl font-bold">Configuración de Pedidos</div>
      <p className="text-gray-600 mt-2">
        Aquí puedes ajustar las configuraciones relacionadas con los pedidos.
      </p>

      <section className="mt-6">
        <h2 className="text-lg font-semibold">Receptor de pedidos</h2>
        <p className="text-sm text-gray-600">
          Selecciona el monitor donde se mostrarán los pedidos.
        </p>
        <MonitorSelector monitors={monitors} />
      </section>
    </main>
  );
}
