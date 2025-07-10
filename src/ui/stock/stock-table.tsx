// ui/stock/stock-table.tsx
"use client";

import { useState, useCallback, memo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StockTableSkeleton } from "../skeletons";
import MaterialRow from "@/app/(protected)/inventario/MaterialRow";
import { OutputModal } from "./outputModal";
import { useFetchFilteredMaterials } from "@/hooks/useInventory";
import { Material } from "@/lib/types";
import { useResponsiveItemsPerPage } from "@/hooks/useResponsiveItemsPerPage";
import { usePagination } from "@/hooks/usePagination";
import TablePagination from "@/components/pagination";
import { Search } from "lucide-react";

interface StockTableProps {
  query: string;
}

function StockTable({ query }: StockTableProps) {
  const {
    data: materials,
    isLoading,
    isError,
  } = useFetchFilteredMaterials({ query });

  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  );

  const itemsPerPage = useResponsiveItemsPerPage(70);

  // Utilizamos el hook de paginación
  const { currentPage, totalPages, currentData, changePage } =
    usePagination<Material>(materials, itemsPerPage);

  const openModal = useCallback((material: Material) => {
    setSelectedMaterial(material);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedMaterial(null);
  }, []);

  if (isLoading) return <StockTableSkeleton />;

  if (isError)
    return (
      <div className="flex items-center justify-center p-8 text-center">
        <div className="text-red-500 bg-red-50 px-4 py-3 rounded-lg border border-red-200">
          <p className="font-medium">Error al cargar los materiales</p>
          <p className="text-sm mt-1">Por favor, intenta nuevamente</p>
        </div>
      </div>
    );

  return (
    <>
      <div className="flex flex-col justify-between min-h-[500px]">
        <div className="overflow-hidden rounded-lg">
          <Table className="table-fixed">
            <TableHeader>
              <TableRow className="bg-gray-50/50 border-b border-gray-200/50">
                <TableHead className="w-[32%] font-semibold text-gray-700 py-4">
                  Nombre
                </TableHead>
                <TableHead className="w-[18%] font-semibold text-gray-700 py-4">
                  Unidad
                </TableHead>
                <TableHead className="text-center w-[13%] font-semibold text-gray-700 py-4">
                  Existencias
                </TableHead>
                <TableHead className="text-center w-[12%] font-semibold text-gray-700 py-4">
                  Estado
                </TableHead>
                <TableHead className="text-center w-[30%] font-semibold text-gray-700 py-4">
                  Actualizado
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData?.length > 0 ? (
                currentData?.map((material) => (
                  <MaterialRow
                    key={material.id}
                    material={material}
                    onClick={openModal}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-gray-500 py-12"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <Search className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="font-medium">
                        No se encontraron materiales
                      </p>
                      <p className="text-sm text-gray-400">
                        Intenta con otros términos de búsqueda
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {currentData?.length > 0 && (
          <div className="mt-6">
            <TablePagination
              currentPage={currentPage}
              handlePageChange={changePage}
              totalPages={totalPages}
            />
          </div>
        )}
      </div>
      {selectedMaterial && (
        <OutputModal material={selectedMaterial} closeModal={closeModal} />
      )}
    </>
  );
}

export default memo(StockTable);
