// src/app/labels/history/page.tsx
import LabelsHistory from "../components/labels-history";

export default function LabelsHistoryPage() {
  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Historial de Etiquetas</h1>
      <LabelsHistory />
    </div>
  );
}
