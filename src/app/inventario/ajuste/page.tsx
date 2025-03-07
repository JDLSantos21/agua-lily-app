// app/dashboard/stock/ajust/page.tsx
"use client";
import { useState, useEffect } from "react";
import { Adjustment } from "@/types/materials/adjustment";
import AdjustTable from "./adjusts-table";
import AdjustTableSkeleton from "./adjust-table-skeleton";
import { fetchAdjustments } from "@/api/inventory";
import { useResponsiveItemsPerPage } from "@/hooks/useResponsiveItemsPerPage";
import { usePagination } from "@/hooks/usePagination";
import TablePagination from "@/components/pagination";

export default function StockAjustPage() {
  const [adjustments, setAdjustments] = useState<Adjustment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Cantidad de items por página de forma responsiva
  const itemsPerPage = useResponsiveItemsPerPage();

  useEffect(() => {
    setLoading(true);
    fetchAdjustments().then((data) => {
      setAdjustments(data);
      setLoading(false);
    });
  }, []);

  // hook de paginación
  const { currentPage, totalPages, currentData, changePage } = usePagination(
    adjustments,
    itemsPerPage
  );

  return (
    <div className="h-[calc(100vh-13rem)] mx-auto flex flex-col justify-between">
      <div className="table-container">
        {loading ? (
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
