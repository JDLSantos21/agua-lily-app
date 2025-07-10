// src/app/clientes/components/customers-pagination.tsx - REDISEÑADO
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { useCallback, useMemo } from "react";

interface CustomersPaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function CustomersPagination({
  totalPages,
  currentPage,
  onPageChange,
}: CustomersPaginationProps) {
  const handlePageClick = useCallback(
    (page: number) => {
      onPageChange(page);
    },
    [onPageChange]
  );

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
    const pages: (number | string)[] = [];
    const maxVisiblePages = 7;

    if (totalPages <= maxVisiblePages) {
      // Si hay pocas páginas, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Siempre mostrar la primera página
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Mostrar páginas alrededor de la actual
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Siempre mostrar la última página
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      {/* Botón anterior */}
      <Button
        variant="outline"
        size="sm"
        onClick={handlePreviousPage}
        disabled={!canGoPrevious}
        className="flex items-center space-x-1 h-9 px-3 border-gray-200 hover:bg-gray-50 disabled:opacity-50"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Anterior</span>
      </Button>

      {/* Números de página */}
      <div className="flex items-center space-x-1">
        {pageNumbers.map((page, index) => (
          <div key={index}>
            {page === "..." ? (
              <div className="flex items-center justify-center w-9 h-9">
                <MoreHorizontal className="w-4 h-4 text-gray-400" />
              </div>
            ) : (
              <Button
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageClick(page as number)}
                className={`w-9 h-9 p-0 ${
                  currentPage === page
                    ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                    : "border-gray-200 hover:bg-gray-50 text-gray-700"
                }`}
              >
                {page}
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Botón siguiente */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleNextPage}
        disabled={!canGoNext}
        className="flex items-center space-x-1 h-9 px-3 border-gray-200 hover:bg-gray-50 disabled:opacity-50"
      >
        <span className="hidden sm:inline">Siguiente</span>
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
