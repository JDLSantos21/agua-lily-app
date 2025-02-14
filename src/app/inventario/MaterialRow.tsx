// ui/stock/MaterialRow.tsx
"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import moment from "moment";
import { Material } from "@/lib/types";

interface MaterialRowProps {
  material: Material;
  onClick: (material: Material) => void;
}

export default function MaterialRow({ material, onClick }: MaterialRowProps) {
  return (
    <TableRow onClick={() => onClick(material)} className="cursor-pointer">
      <TableCell>{material.name}</TableCell>
      <TableCell>{material.unit}</TableCell>
      <TableCell className="text-center">{material.stock}</TableCell>
      <TableCell className="flex justify-center">
        <div
          className={`w-3 h-3 rounded-full ${
            material.stock! <= material.minimum_stock
              ? "bg-red-500 animate-pulse"
              : material.stock! <= material.minimum_stock * 1.5
              ? "bg-yellow-500"
              : "bg-blue-500"
          }`}
        />
      </TableCell>
      <TableCell className="text-center">
        {moment(material.updated_at).format("lll")}
      </TableCell>
    </TableRow>
  );
}
