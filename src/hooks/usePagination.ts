// hooks/usePagination.ts
import { useState, useMemo, useEffect } from "react";

export function usePagination<T>(
  data: T[] | undefined | null,
  itemsPerPage: number
) {
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Reinicia la página actual cuando cambian los items por página
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const safeData = useMemo(() => data ?? [], [data]);

  const totalPages = useMemo(
    () => Math.ceil(safeData.length / itemsPerPage),
    [safeData, itemsPerPage]
  );

  const currentData = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return safeData.slice(indexOfFirstItem, indexOfLastItem);
  }, [currentPage, itemsPerPage, safeData]);

  const changePage = (page: number) => {
    setCurrentPage(page);
  };

  return { currentPage, totalPages, currentData, changePage };
}
