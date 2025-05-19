// src/components/Empty.tsx
import { ReactNode } from "react";
import { FolderX } from "lucide-react";

interface EmptyProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function Empty({
  title = "No hay datos",
  description = "No se encontraron registros para mostrar",
  icon = <FolderX className="h-10 w-10 text-gray-400" />,
  action,
  className = "",
}: EmptyProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
    >
      <div className="rounded-full bg-gray-100 p-4 mb-4">{icon}</div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-md mb-4">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
