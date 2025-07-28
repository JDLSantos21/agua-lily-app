import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader } from "lucide-react";

// Tipos genéricos para la tabla
export interface TableColumn<T = any> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  width?: string;
  className?: string;
}

export interface CustomTableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  onRowClick?: (item: T, index: number) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
  rowClassName?: string | ((item: T, index: number) => string);
  headerClassName?: string;
}

export function CustomTable<T extends Record<string, any>>({
  data = [],
  columns,
  onRowClick,
  isLoading = false,
  emptyMessage = "No hay datos disponibles",
  className = "",
  rowClassName = "cursor-pointer hover:bg-gray-50 transition-colors",
  headerClassName = "border-b-2 border-gray-100",
}: CustomTableProps<T>) {
  const handleRowClick = (item: T, index: number) => {
    if (onRowClick) {
      onRowClick(item, index);
    }
  };

  const getRowClassName = (item: T, index: number): string => {
    if (typeof rowClassName === "function") {
      return rowClassName(item, index);
    }
    return rowClassName || "";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <Table>
        <TableHeader>
          <TableRow className={headerClassName}>
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={`text-gray-700 font-semibold py-4 ${column.width ? `w-[${column.width}]` : ""} ${column.className || ""}`}
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center py-8 text-gray-500"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow
                key={item.id || index}
                className={getRowClassName(item, index)}
                onClick={() => handleRowClick(item, index)}
              >
                {columns.map((column) => (
                  <TableCell key={column.key} className="py-3">
                    {column.render
                      ? column.render(item)
                      : item[column.key] || "-"}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
