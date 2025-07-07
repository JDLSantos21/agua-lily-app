import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useMemo } from "react";

export default function CustomersPagination({
  totalPages,
  currentPage,
  onPageChange,
}: {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}) {
  // const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePageClick = useCallback((page: number) => {
    onPageChange(page);
  }, []);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  // Generar números de página para mostrar
  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Si hay pocas páginas, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica más compleja para muchas páginas
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, currentPage + 2);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Agregar primera página si no está incluida
      if (start > 1) {
        pages.unshift(1);
        if (start > 2) {
          pages.splice(1, 0, -1); // -1 representa "..."
        }
      }

      // Agregar última página si no está incluida
      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push(-1); // -1 representa "..."
        }
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="flex justify-center mt-8">
      <div className="flex items-center gap-1">
        {/* Botón Anterior */}
        <Button
          variant="outline"
          size="sm"
          onClick={handlePreviousPage}
          disabled={!canGoPrevious}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Números de página */}
        <div className="flex gap-1 mx-2">
          {pageNumbers.map((pageNum, index) =>
            pageNum === -1 ? (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-1 text-gray-500"
              >
                ...
              </span>
            ) : (
              <Button
                key={pageNum}
                variant="outline"
                size="sm"
                onClick={() => handlePageClick(pageNum)}
                className={`px-3 ${
                  currentPage === pageNum
                    ? "bg-blue-600/10 "
                    : "hover:bg-primary/10"
                }`}
              >
                {pageNum}
              </Button>
            )
          )}
        </div>

        {/* Botón Siguiente */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextPage}
          disabled={!canGoNext}
          className="flex items-center gap-1"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
