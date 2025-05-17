// src/app/clientes/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CustomerFilters } from "./components/customer-filters";
import { CustomerList } from "./components/customer-list";
import { CustomerStats } from "./components/customer-stats";
import { CustomerViewDialog } from "./components/customer-view-dialog";
import { CustomerFormDialog } from "./components/customer-form-dialog";
import { CustomerFilter } from "@/types/customers.types";
import { useCustomers } from "@/hooks/useCustomers";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function ClientesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check URL for modal actions
  const viewId = searchParams.get("view");
  const editId = searchParams.get("edit");

  const [filters, setFilters] = useState<CustomerFilter>({
    limit: 10,
    offset: 0,
  });

  const { data, isLoading, error } = useCustomers(filters);

  // Dialog states management
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null
  );

  // Update URL when opening/closing dialogs
  useEffect(() => {
    if (viewId) {
      setSelectedCustomerId(Number(viewId));
      setViewDialogOpen(true);
    } else if (editId) {
      setSelectedCustomerId(Number(editId));
      setEditDialogOpen(true);
    }
  }, [viewId, editId]);

  const handleViewCustomer = (id: number) => {
    setSelectedCustomerId(id);
    setViewDialogOpen(true);
    router.push(`/clientes?view=${id}`, { scroll: false });
  };

  const handleEditCustomer = (id: number) => {
    setSelectedCustomerId(id);
    setEditDialogOpen(true);
    router.push(`/clientes?edit=${id}`, { scroll: false });
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    router.push("/clientes", { scroll: false });
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    router.push("/clientes", { scroll: false });
  };

  const handleFilterChange = (newFilters: CustomerFilter) => {
    setFilters((prev) => ({ ...prev, ...newFilters, offset: 0 }));
  };

  const handlePageChange = (offset: number) => {
    setFilters((prev) => ({ ...prev, offset }));
  };

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error instanceof Error
            ? error.message
            : "Error al cargar los clientes"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <CustomerStats />
      </div>

      <CustomerFilters onFilterChange={handleFilterChange} />

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <CustomerList
          customers={data?.data || []}
          pagination={data?.pagination}
          onPageChange={handlePageChange}
          onViewCustomer={handleViewCustomer}
          onEditCustomer={handleEditCustomer}
        />
      )}

      {/* View Dialog */}
      {selectedCustomerId && (
        <CustomerViewDialog
          customerId={selectedCustomerId}
          open={viewDialogOpen}
          onClose={handleCloseViewDialog}
        />
      )}

      {/* Edit Dialog */}
      {selectedCustomerId && (
        <CustomerFormDialog
          customerId={selectedCustomerId}
          open={editDialogOpen}
          onClose={handleCloseEditDialog}
        />
      )}
    </div>
  );
}
