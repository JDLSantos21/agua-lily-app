import { Monitor } from "@tauri-apps/api/window";
import { ReceptorWindow } from "@/shared/tauri/windows/receptor";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function MonitorSelector({ monitors }: { monitors: Monitor[] }) {
  const handleMonitorSelect = async (monitor: Monitor) => {
    try {
      await ReceptorWindow.changeMonitor(monitor);
    } catch (error) {
      console.error("Error al cambiar la posición del receptor:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="mt-4">
          Seleccionar Monitor
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-4 p-4">
        <DialogHeader>
          <DialogTitle>Seleccionar Monitor</DialogTitle>
          <DialogDescription className="text-gray-600">
            Selecciona el monitor donde se mostrarán los pedidos.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 grid-cols-2 place-items-center">
          {monitors.length === 0 && (
            <div className="text-gray-500">No hay monitores disponibles</div>
          )}
          {monitors.map((monitor) => (
            <div
              key={monitor.position.x}
              onClick={() => handleMonitorSelect(monitor)}
              className="w-full border border-blue-600 h-40 cursor-pointer bg-white rounded-md flex items-center justify-center hover:bg-blue-50 transition-colors duration-300"
            >
              <div className="text-center">
                <h3 className="font-semibold">{monitor.name}</h3>
                <p className="text-sm text-gray-500">
                  Resolución: {monitor.size.width}x{monitor.size.height}
                </p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
