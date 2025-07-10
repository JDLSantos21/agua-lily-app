// ui/stock/MaterialRow.tsx
"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Material } from "@/lib/types";
import { format } from "@formkit/tempo";

interface MaterialRowProps {
  material: Material;
  onClick: (material: Material) => void;
}

export default function MaterialRow({ material, onClick }: MaterialRowProps) {
  const getStatusColor = () => {
    const stock = Number(material.stock);
    const minStock = Number(material.minimum_stock);

    if (stock <= minStock) {
      return "bg-red-500 animate-pulse";
    } else if (stock <= minStock * 1.5) {
      return "bg-yellow-500";
    } else {
      return "bg-emerald-500";
    }
  };

  const getStatusText = () => {
    const stock = Number(material.stock);
    const minStock = Number(material.minimum_stock);

    if (stock <= minStock) {
      return { text: "Crítico", color: "text-red-600" };
    } else if (stock <= minStock * 1.5) {
      return { text: "Bajo", color: "text-yellow-600" };
    } else {
      return { text: "Normal", color: "text-emerald-600" };
    }
  };

  const status = getStatusText();

  return (
    <TableRow
      onClick={() => onClick(material)}
      className="cursor-pointer hover:bg-gray-50/50 transition-colors duration-150 border-b border-gray-200/50"
    >
      <TableCell className="py-4">
        <div className="font-medium text-gray-900">{material.name}</div>
      </TableCell>
      <TableCell className="py-4">
        <span className="text-gray-600">{material.unit}</span>
      </TableCell>
      <TableCell className="text-center py-4">
        <span className="font-semibold text-gray-900">{material.stock}</span>
      </TableCell>
      <TableCell className="py-4">
        <div className="flex items-center justify-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
          <span className={`text-xs font-medium ${status.color}`}>
            {status.text}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-center py-4">
        <span className="text-sm text-gray-600">
          {format(material.updated_at, { date: "medium", time: "short" })}
        </span>
      </TableCell>
    </TableRow>
  );
}
