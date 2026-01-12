"use client";

import { useMemo, useState, useCallback } from "react";
import { useCustomerStore } from "@/stores/customerStore";
import { CustomerFilters } from "./components/customer-filters";
import CustomerFormDialog from "./components/customer-form-dialog";
import CustomerViewDialog from "./components/customer-view-dialog";
import { Customer, CustomerFilter } from "@/types/customers.types";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Users,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { LoaderSpin } from "@/components/Loader";
import { useCustomers } from "@/hooks/useCustomers";
import { CustomTable } from "@/components/ui/custom-table";
import { CUSTOMER_COLUMNS } from "./constants";

// Configuración de paginación
const ITEMS_PER_PAGE = 10;

export default function ClientesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<CustomerFilter>({});

  // Obtener estado del store
  const {
    dialogState,
    openViewDialog,
    openFormDialog,
    closeViewDialog,
    closeFormDialog,
  } = useCustomerStore();

  // Calcular offset basado en la página actual
  const offset = useMemo(
    () => (currentPage - 1) * ITEMS_PER_PAGE,
    [currentPage]
  );

  // Filtros con paginación
  const filtersWithPagination = useMemo(
    () => ({
      ...filters,
      limit: ITEMS_PER_PAGE,
      offset: offset,
    }),
    [filters, offset]
  );

  // Consultas de datos con TanStack Query
  const {
    data: customersResponse,
    isLoading,
    refetch: customersRefetch,
    error,
  } = useCustomers(filtersWithPagination, {
    refetchOnWindowFocus: false,
    placeholderData: (old) => old,
  });

  // Memoizar la lista de clientes para evitar re-renderizados
  const customers = useMemo(
    () => customersResponse?.data || [],
    [customersResponse]
  );

  const pagination = useMemo(
    () => customersResponse?.pagination,
    [customersResponse]
  );

  // Calcular información de paginación
  const totalPages = useMemo(
    () => Math.ceil((pagination?.total || 0) / ITEMS_PER_PAGE),
    [pagination?.total]
  );

  // Manejador de cambio de filtros generales
  const handleFiltersChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  // Funciones de paginación
  const handlePreviousPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const handleNextPage = useCallback(() => {
    const paginationData = customersResponse?.pagination;
    const total = paginationData?.total || 0;
    const maxPages = Math.ceil(total / ITEMS_PER_PAGE);
    if (currentPage < maxPages) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, customersResponse?.pagination]);

  const handlePageClick = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  // Generar números de página para mostrar
  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, currentPage + 2);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (start > 1) {
        pages.unshift(1);
        if (start > 2) {
          pages.splice(1, 0, -1);
        }
      }

      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push(-1);
        }
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  // Manejar clic en fila
  const handleRowClick = useCallback(
    (customer: Customer) => {
      openViewDialog(customer.id as number);
    },
    [openViewDialog]
  );

  const handleClose = useCallback(() => {
    closeViewDialog();
  }, [closeViewDialog]);

  // Estado de error
  if (error) {
    return (
      <div className="p-6 relative min-h-[calc(100vh-185px)]">
        <div className="text-red-500 bg-red-50 px-4 py-3 rounded-lg border border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5" />
            <p className="font-medium">Error al cargar los clientes</p>
          </div>
          <p className="text-sm">
            No se pudieron cargar los datos. Verifique su conexión e intente
            nuevamente.
          </p>
          <Button
            onClick={() => customersRefetch()}
            className="mt-3"
            variant="outline"
            size="sm"
          >
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 relative min-h-[calc(100vh-185px)]">
      {/* Header minimalista */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Lista de Clientes
            </h1>
            <p className="text-sm text-gray-500">
              {pagination?.total
                ? `${pagination.total} cliente${pagination.total !== 1 ? "s" : ""} registrado${pagination.total !== 1 ? "s" : ""}`
                : "Cargando..."}
            </p>
          </div>
        </div>
        <Button
          onClick={() => openFormDialog()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Filtros */}
      <CustomerFilters
        onChange={handleFiltersChange}
        initialFilters={filters}
      />

      {/* Tabla de clientes */}
      {isLoading ? (
        <LoaderSpin text="Cargando clientes..." />
      ) : (
        <>
          <CustomTable
            data={customers}
            columns={CUSTOMER_COLUMNS}
            onRowClick={handleRowClick}
            isLoading={isLoading}
            emptyMessage={
              Object.keys(filters).length > 0
                ? "No se encontraron clientes con los filtros aplicados"
                : "No hay clientes registrados"
            }
            className="rounded-lg shadow-sm mb-6"
          />

          {/* Paginación */}
          {pagination && totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 shadow-sm p-1">
                {/* Botón Anterior */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={!canGoPrevious}
                  className="flex items-center gap-1 text-gray-600 hover:text-gray-900 disabled:opacity-50"
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
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePageClick(pageNum)}
                        className={`px-3 ${
                          currentPage === pageNum
                            ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        {pageNum}
                      </Button>
                    )
                  )}
                </div>

                {/* Botón Siguiente */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={!canGoNext}
                  className="flex items-center gap-1 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Diálogos */}
      <CustomerFormDialog
        open={dialogState.formDialog.isOpen}
        onOpenChange={closeFormDialog}
        customer={dialogState.formDialog.customer}
        onSuccess={() => {
          customersRefetch();
        }}
      />

      {dialogState.viewDialog.customerId && (
        <CustomerViewDialog
          customerId={dialogState.viewDialog.customerId}
          onClose={handleClose}
          onEdit={(customer) => {
            closeViewDialog();
            openFormDialog(customer);
          }}
        />
      )}
    </div>
  );
}
