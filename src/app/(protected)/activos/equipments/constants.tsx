import { Badge } from "@/components/ui/badge";
import { TableColumn } from "@/components/ui/custom-table";
import { Equipment } from "@/types/equipments.types";
import { FileText } from "lucide-react";

export const MAIN_COLUMNS: TableColumn<Equipment>[] = [
  {
    key: "id",
    label: "ID",
    width: "10%",
    render: (equipment) => (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <FileText className="h-4 w-4 text-blue-600" />
        </div>
        <span className="font-medium">{equipment.id}</span>
      </div>
    ),
  },
  {
    key: "type",
    label: "Tipo",
    width: "15%",
    render: (equipment) => (
      <Badge variant="outline" className="font-medium">
        {equipment.type}
      </Badge>
    ),
  },
  {
    key: "model",
    label: "Modelo",
    width: "25%",
    render: (equipment) => (
      <div>
        <div className="font-medium text-gray-900">{equipment.model}</div>
        <div className="text-sm text-gray-500">{equipment.brand}</div>
      </div>
    ),
  },
  {
    key: "serial_number",
    label: "Número de Serie",
    width: "20%",
    render: (equipment) => (
      <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
        {equipment.serial_number}
      </span>
    ),
  },
  {
    key: "status",
    label: "Estado",
    width: "15%",
    render: (equipment) => (
      <Badge variant="standardTrip">{equipment.status}</Badge>
    ),
  },
  {
    key: "notes",
    label: "Notas",
    width: "15%",
    render: (equipment) => (
      <div className="text-sm text-gray-600 max-w-xs truncate">
        {equipment.notes || "Sin notas"}
      </div>
    ),
  },
];
