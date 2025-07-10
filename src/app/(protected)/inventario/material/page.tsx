"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableHeader,
} from "@/components/ui/table";
import type { Material } from "@/lib/types";
import MaterialsDetailsModal from "./material-details-modal";
import { useState } from "react";
import { MaterialsTableSkeleton } from "@/ui/skeletons";
import { useResponsiveItemsPerPage } from "@/hooks/useResponsiveItemsPerPage";
import { usePagination } from "@/hooks/usePagination";
import TablePagination from "@/components/pagination";
import { format } from "@formkit/tempo";
import { useMaterials } from "@/hooks/useInventory";

export default function MaterialPage() {
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  );

  const { data: materials, isLoading, isError } = useMaterials();

  const itemsPerPage = useResponsiveItemsPerPage(57);

  const { currentPage, totalPages, currentData, changePage } = usePagination(
    materials,
    itemsPerPage
  );

  const openModal = (material: Material) => {
    setSelectedMaterial(material);
  };

  if (isLoading) {
    return <MaterialsTableSkeleton />;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200/50">
      <div className="flex flex-col justify-between min-h-[500px]">
        <div className="overflow-hidden rounded-lg">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="text-left w-[35%] font-semibold text-gray-700 py-4">
                  Material
                </TableHead>
                <TableHead className="text-left w-[20%] font-semibold text-gray-700 py-4">
                  Categoría
                </TableHead>
                <TableHead className="text-left w-[15%] font-semibold text-gray-700 py-4">
                  Cantidad
                </TableHead>
                <TableHead className="text-left w-[30%] font-semibold text-gray-700 py-4">
                  Actualizado
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isError ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12">
                    <div className="text-red-500 bg-red-50 px-4 py-3 rounded-lg border border-red-200 inline-block">
                      <p className="font-medium">
                        Error al cargar los materiales
                      </p>
                      <p className="text-sm mt-1">
                        Por favor, intenta nuevamente
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : currentData?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12">
                    <div className="text-gray-500">
                      <p className="font-medium">No hay materiales</p>
                      <p className="text-sm mt-1">
                        Agrega nuevos materiales para comenzar
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                (currentData as Material[])?.map((material) => (
                  <TableRow
                    key={material.id}
                    className="cursor-pointer hover:bg-gray-50/50 transition-colors duration-150 border-b border-gray-200/50"
                    onClick={() => openModal(material)}
                  >
                    <TableCell className="py-4">
                      <div className="font-medium text-gray-900">
                        {material.name}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-gray-600">{material.category}</span>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="font-semibold text-gray-900">
                        {material.stock}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-sm text-gray-600">
                        {format(material.updated_at, {
                          date: "medium",
                          time: "short",
                        })}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {currentData?.length > 0 && (
          <div className="mt-6">
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={changePage}
            />
          </div>
        )}
      </div>

      {selectedMaterial && (
        <MaterialsDetailsModal
          material={selectedMaterial}
          closeModal={() => setSelectedMaterial(null)}
        />
      )}
    </div>
  );
}
