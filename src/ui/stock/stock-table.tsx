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
import MaterialRow from "@/app/inventario/MaterialRow";
import { OutputModal } from "./outputModal";
import { useFetchFilteredStock } from "@/hooks/useFetchFilteredStock";
import { Material } from "@/lib/types";
import { useResponsiveItemsPerPage } from "@/hooks/useResponsiveItemsPerPage";
import { usePagination } from "@/hooks/usePagination";
import TablePagination from "@/components/pagination";

interface StockTableProps {
  query: string;
}

function StockTable({ query }: StockTableProps) {
  const { materials, loading, error, setMaterials } =
    useFetchFilteredStock(query);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  );

  const itemsPerPage = useResponsiveItemsPerPage(70);

  // Utilizamos el hook de paginación
  const { currentPage, totalPages, currentData, changePage } = usePagination(
    materials,
    itemsPerPage
  );

  // Actualiza el stock de un material y actualiza la fecha de modificación
  const updateStock = useCallback(
    ({ quantity, id }: { quantity: number; id: number }) => {
      const currentDate = new Date().toISOString();
      setMaterials((prev) =>
        prev.map((material) =>
          material.id === id
            ? {
                ...material,
                stock: (material.stock ?? 0) - quantity,
                updated_at: currentDate,
              }
            : material
        )
      );
    },
    [setMaterials]
  );

  const openModal = useCallback((material: Material) => {
    setSelectedMaterial(material);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedMaterial(null);
  }, []);

  if (loading) return <StockTableSkeleton />;

  if (error)
    return (
      <div className="text-center text-red-500">Error: {error.message}</div>
    );

  return (
    <>
      <div className="flex flex-col justify-between h-[calc(100vh-15rem)]">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[32%]">Nombre</TableHead>
              <TableHead className="w-[18%]">Unidad</TableHead>
              <TableHead className="text-center w-[13%]">Existencias</TableHead>
              <TableHead className="text-center w-[12%]">Estado</TableHead>
              <TableHead className="text-center w-[30%]">Actualizado</TableHead>
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
                <TableCell colSpan={5} className="text-center text-gray-600">
                  No se encontraron materiales
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          currentPage={currentPage}
          handlePageChange={changePage}
          totalPages={totalPages}
        />
      </div>
      {selectedMaterial && (
        <OutputModal
          material={selectedMaterial}
          closeModal={closeModal}
          updateFunc={updateStock}
        />
      )}
    </>
  );
}

export default memo(StockTable);
