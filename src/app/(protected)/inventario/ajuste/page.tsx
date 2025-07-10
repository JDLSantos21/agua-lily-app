// app/dashboard/stock/ajust/page.tsx
"use client";
import { Adjustment } from "@/types/materials/adjustment";
import AdjustTable from "./adjusts-table";
import AdjustTableSkeleton from "./adjust-table-skeleton";
import { useResponsiveItemsPerPage } from "@/hooks/useResponsiveItemsPerPage";
import { usePagination } from "@/hooks/usePagination";
import TablePagination from "@/components/pagination";
import { useFetchAdjustments } from "@/hooks/useInventory";

export default function StockAjustPage() {
  const { data: adjustments, isLoading } = useFetchAdjustments();

  // Cantidad de items por página de forma responsiva
  const itemsPerPage = useResponsiveItemsPerPage();

  // hook de paginación
  const { currentPage, totalPages, currentData, changePage } =
    usePagination<Adjustment>(adjustments, itemsPerPage);

  return (
    <div className="h-[calc(100vh-13rem)] mx-auto flex flex-col justify-between">
      <div className="table-container">
        {isLoading ? (
          <AdjustTableSkeleton />
        ) : adjustments.length !== 0 ? (
          <AdjustTable currentData={currentData} />
        ) : (
          <div className="text-gray-500 text-center">
            No hay ajustes registrados
          </div>
        )}
      </div>
      <TablePagination
        currentPage={currentPage}
        handlePageChange={changePage}
        totalPages={totalPages}
      />
    </div>
  );
}
