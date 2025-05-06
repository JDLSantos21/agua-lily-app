import ReopenSessionPanel from "@/app/viajes/components/reopen-session-panel";

export default function LabelSettingsPage() {
  return (
    <div className="flex flex-col w-full">
      <div className="flex w-full">
        <h1 className="text-2xl font-bold">Configuración de Etiquetas</h1>
      </div>
      <div className="pt-20">
        <ReopenSessionPanel />
      </div>
    </div>
  );
}
