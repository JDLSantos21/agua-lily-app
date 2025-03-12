"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableHeader,
} from "@/components/ui/table";
import moment from "moment";
moment.locale("es");
import type { Material } from "@/lib/types";
import MaterialsDetailsModal from "./material-details-modal";
import { useState } from "react";
import { MaterialsTableSkeleton } from "@/ui/skeletons";
import { useResponsiveItemsPerPage } from "@/hooks/useResponsiveItemsPerPage";
import { usePagination } from "@/hooks/usePagination";
import TablePagination from "@/components/pagination";
import { useFetchFilteredStock } from "@/hooks/useFetchFilteredStock";
// import {
//   ContextMenuCheckboxItem,
//   ContextMenu,
//   ContextMenuItem,
//   ContextMenuContent,
//   ContextMenuLabel,
// } from "@/components/ui/context-menu";

export default function Material() {
  const { materials, loading, setMaterials } = useFetchFilteredStock();
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  );

  const itemsPerPage = useResponsiveItemsPerPage(57);
  const { currentPage, totalPages, currentData, changePage } = usePagination(
    materials,
    itemsPerPage
  );

  const openModal = (material: Material) => {
    setSelectedMaterial(material);
  };

  if (loading) {
    return <MaterialsTableSkeleton />;
  }

  return (
    <>
      <div className="h-[calc(100vh-12rem)] flex flex-col justify-between">
        <Table className="w-full border-collapse">
          <TableHeader>
            <TableRow className="border-b">
              <TableHead className="text-left w-[35%]">Material</TableHead>
              <TableHead className="text-left w-[15%]">Categoría</TableHead>
              <TableHead className="text-left w-[13%]">Cantidad</TableHead>
              <TableHead className="text-left w-[20%]">Actualizado</TableHead>
              <TableHead className="text-left w-[17%]">Creado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="p-2 text-center">
                  No hay materiales
                </TableCell>
              </TableRow>
            ) : (
              currentData?.map((material: Material) => (
                <TableRow
                  key={material.id}
                  className="border-b cursor-pointer"
                  onClick={() => openModal(material)}
                >
                  <TableCell className="h-12 p-3">{material.name}</TableCell>
                  <TableCell className="p-3">{material.category}</TableCell>
                  <TableCell className="p-3">{material.stock}</TableCell>
                  <TableCell className="p-3">
                    {moment(material.updated_at).format("L HH:mm")}
                  </TableCell>
                  <TableCell className="p-3">
                    {moment(material.created_at).format("L")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={changePage}
        />
      </div>

      {selectedMaterial && (
        <MaterialsDetailsModal
          material={selectedMaterial}
          closeModal={() => setSelectedMaterial(null)}
          setMaterials={setMaterials} // Pasamos la función para actualizar la tabla
        />
      )}
    </>
  );
}
