// app/dashboard/stock/ajust/page.tsx
"use client";
import { useState, useEffect } from "react";
import NewAjustDialog from "./new-dialog";
import { Adjustment } from "@/types/materials/adjustment";
import AdjustTable from "./adjusts-table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import AdjustTableSkeleton from "./adjust-table-skeleton";
import { AdjustmentsSearchModal } from "./adjustments-search-modal";
import { fetchAdjustments } from "@/lib/data";

export default function StockAjustPage() {
  const [adjustments, setAdjustments] = useState<Adjustment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1); // Estado para la página actual
  const itemsPerPage = 8; // Número de elementos por página

  useEffect(() => {
    setLoading(true);
    fetchAdjustments().then((data) => {
      setAdjustments(data);
      console.log(data);
      setLoading(false);
    });
  }, []);

  // Calcular los datos de la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = adjustments.slice(indexOfFirstItem, indexOfLastItem);

  // Calcular el número total de páginas
  const totalPages = Math.ceil(adjustments.length / itemsPerPage);

  // Cambiar de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="h-[calc(100vh-13rem)] relative mx-auto">
      {/* Botón para abrir modal de nuevo ajuste */}
      <div className="mb-4 flex space-x-2">
        <AdjustmentsSearchModal />
        <NewAjustDialog />
      </div>

      <div className="table-container h-3/4 flex justify-between mb-4">
        {/* Listado de ajustes */}
        {loading ? (
          <AdjustTableSkeleton />
        ) : (
          <>
            <AdjustTable currentData={currentData} />
          </>
        )}
      </div>

      {/* Paginación */}
      <Pagination className="absolute bottom-2">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(currentPage - 1)}
              className={currentPage === 1 ? "opacity-0" : ""}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i + 1}>
              <PaginationLink
                onClick={() => handlePageChange(i + 1)}
                isActive={currentPage === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(currentPage + 1)}
              className={currentPage === totalPages ? "opacity-0" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
