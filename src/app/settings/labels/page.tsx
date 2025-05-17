import Link from "next/link";
import SessionManagerPanel from "./components/session-manager-panel";
import { Button } from "@/components/ui/button";
import ReportSettingsPanel from "./components/report-settings-panel";

export default function LabelSettingsPage() {
  return (
    <div className="flex flex-col w-full">
      <div className="flex w-full">
        <h1 className="text-2xl font-bold">Configuración de Etiquetas</h1>
      </div>

      <div className="pt-10 space-y-2">
        <Link href={"/settings/labels/history"}>
          <Button variant="outline">Historial de Etiquetas</Button>
        </Link>
        <SessionManagerPanel />
        <ReportSettingsPanel />
      </div>
    </div>
  );
}
