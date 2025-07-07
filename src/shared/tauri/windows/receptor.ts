import {
  availableMonitors,
  Monitor,
  PhysicalPosition,
  PhysicalSize,
} from "@tauri-apps/api/window";
import {
  WebviewWindow,
  getAllWebviewWindows,
} from "@tauri-apps/api/webviewWindow";
import { toast } from "sonner";

export class ReceptorWindow {
  static async open() {
    const webViews = await getAllWebviewWindows();

    if (webViews.some((webView) => webView.label === "receptor")) {
      toast.info("Ya el receptor está abierto");
      return;
    }

    const monitors = await availableMonitors();
    const monitor = monitors[1] ?? monitors[0];
    const { x, y } = monitor.position;
    const { width, height } = monitor.size;

    // Crear nueva ventana con WebviewWindow
    const appWindow = new WebviewWindow("receptor", {
      url: "/receptor",
      title: "Ventana Receptor",
      width,
      height,
      x,
      y,
      fullscreen: true,
    });

    return appWindow;
  }

  static async changeMonitor(monitor: Monitor) {
    const webViews = await getAllWebviewWindows();

    if (webViews.some((webView) => webView.label === "receptor")) {
      const receptorWindow = webViews.find(
        (webView) => webView.label === "receptor"
      );

      if (receptorWindow) {
        await receptorWindow.setSize(
          new PhysicalSize(monitor.size.width, monitor.size.height)
        );
        await receptorWindow.setPosition(
          new PhysicalPosition(monitor.position.x, monitor.position.y)
        );
        toast.success("Posición del receptor actualizada");
      }
    } else {
      toast.error("El receptor no está abierto");
    }
  }
}
