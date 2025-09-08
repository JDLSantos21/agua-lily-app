"use client";

import { useMemo, useState, useCallback } from "react";
import { useCustomerStore } from "@/stores/customerStore";
import { CustomerFilters } from "./components/customer-filters";
import CustomerFormDialog from "./components/customer-form-dialog";
import CustomerViewDialog from "./components/customer-view-dialog";
import { Customer, CustomerFilter } from "@/types/customers.types";
import { Button } from "@/components/ui/button";
import { Plus, Users, AlertCircle } from "lucide-react";
import { LoaderSpin } from "@/components/Loader";
import { useCustomers } from "@/hooks/useCustomers";
import { CustomTable } from "@/components/ui/custom-table";
import { CUSTOMER_COLUMNS } from "./constants";
import TablePagination from "@/components/pagination";
import { usePagination } from "@/hooks/usePagination";

export default function ClientesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<CustomerFilter>({});

  // Obtener estado del store
  const {
    dialogState,
    openViewDialog,
    openFormDialog,
    openDeleteDialog,
    closeViewDialog,
    closeFormDialog,
  } = useCustomerStore();

  const CUSTOMERS_PER_PAGE = 10;

  const offset = useMemo(
    () => (currentPage - 1) * CUSTOMERS_PER_PAGE,
    [currentPage]
  );

  const {
    data: customers,
    isLoading,
    refetch: customersRefetch,
    error,
  } = useCustomers({ ...filters, offset, limit: CUSTOMERS_PER_PAGE });

  const pagination = useMemo(() => customers?.pagination || null, [customers]);

  const totalPages = useMemo(
    () => Math.ceil((pagination?.total || 0) / CUSTOMERS_PER_PAGE),
    [pagination?.total]
  );

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

  // Paginación usando el hook personalizado
  const { currentData, changePage } = usePagination(
    customers?.data || [],
    CUSTOMERS_PER_PAGE
  );

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
            <h1 className="text-2xl font-semibold text-gray-900">Clientes</h1>
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
      <CustomerFilters onChange={setFilters} initialFilters={filters} />

      {/* Tabla de clientes */}
      {isLoading ? (
        <LoaderSpin text="Cargando clientes..." />
      ) : (
        <>
          <CustomTable
            data={currentData || []}
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
          {customers && customers.data.length > 0 && (
            <div className="absolute bottom-0 w-full">
              <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={(page) => {
                  setCurrentPage(page);
                  changePage(page);
                }}
              />
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
          onDelete={openDeleteDialog}
        />
      )}
    </div>
  );
}
