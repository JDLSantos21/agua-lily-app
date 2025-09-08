import { Separator } from "@/components/ui/separator";
import { PrintersPageContent } from "@/components/printers";

export default function SettingsPrintersPage() {
  return (
    <div className="container mx-auto max-w-6xl py-8 px-6">
      {/* Header */}
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Configuración de Impresoras
        </h1>
        <p className="text-muted-foreground">
          Gestiona y configura las impresoras para tickets, recibos y etiquetas
        </p>
      </div>

      <Separator className="mb-8" />

      {/* Content */}
      <PrintersPageContent />
    </div>
  );
}
