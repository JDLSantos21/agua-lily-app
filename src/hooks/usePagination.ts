// hooks/usePagination.ts
import { useState, useMemo, useEffect } from "react";

export function usePagination<T>(data: T[], itemsPerPage: number) {
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Reinicia la página actual cuando cambian los items por página
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const totalPages = useMemo(
    () => Math.ceil(data.length / itemsPerPage),
    [data, itemsPerPage]
  );

  const currentData = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return data.slice(indexOfFirstItem, indexOfLastItem);
  }, [currentPage, itemsPerPage, data]);

  const changePage = (page: number) => {
    setCurrentPage(page);
  };

  return { currentPage, totalPages, currentData, changePage };
}
