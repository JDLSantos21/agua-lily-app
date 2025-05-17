// src/app/clientes/components/customer-list.tsx
"use client";

import { Customer } from "@/types/customers.types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash, Building, UserRound } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeleteCustomer } from "@/hooks/useCustomers";
import TablePagination from "@/components/pagination";

interface CustomerListProps {
  customers: Customer[];
  pagination?: {
    total: number;
    limit: number | null;
    offset: number;
  };
  onPageChange: (offset: number) => void;
  onViewCustomer: (id: number) => void;
  onEditCustomer: (id: number) => void;
}

export function CustomerList({
  customers,
  pagination,
  onPageChange,
  onViewCustomer,
  onEditCustomer,
}: CustomerListProps) {
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(
    null
  );
  const deleteCustomerMutation = useDeleteCustomer();

  const handleDeleteClick = (customer: Customer) => {
    setCustomerToDelete(customer);
  };

  const confirmDelete = () => {
    if (customerToDelete?.id) {
      deleteCustomerMutation.mutate(customerToDelete.id, {
        onSuccess: () => {
          setCustomerToDelete(null);
        },
      });
    }
  };

  const cancelDelete = () => {
    setCustomerToDelete(null);
  };

  // Calculate pagination values
  const limit = pagination?.limit || 10;
  const total = pagination?.total || 0;
  const currentPage = Math.floor((pagination?.offset || 0) / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  const handlePageSelect = (page: number) => {
    onPageChange((page - 1) * limit);
  };

  if (customers.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-6 text-center">
        <p className="text-gray-500">
          No se encontraron clientes con los criterios seleccionados.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell className="font-medium">
                {customer.is_business ? customer.business_name : customer.name}
              </TableCell>
              <TableCell>
                {customer.is_business ? (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 w-fit"
                  >
                    <Building className="h-3 w-3" />
                    Empresa
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 w-fit"
                  >
                    <UserRound className="h-3 w-3" />
                    Personal
                  </Badge>
                )}
              </TableCell>
              <TableCell>{customer.contact_phone}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    customer.status === "activo"
                      ? "standardTrip"
                      : "destructive"
                  }
                  className="capitalize"
                >
                  {customer.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onViewCustomer(customer.id!)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEditCustomer(customer.id!)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleDeleteClick(customer)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Paginación */}
      {pagination && totalPages > 1 && (
        <div className="p-4 border-t">
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageSelect}
          />
        </div>
      )}

      {/* Diálogo de confirmación para eliminar */}
      <Dialog
        open={!!customerToDelete}
        onOpenChange={(open) => !open && cancelDelete()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar al cliente{" "}
              <span className="font-semibold">
                {customerToDelete?.is_business
                  ? customerToDelete?.business_name
                  : customerToDelete?.name}
              </span>
              ? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={cancelDelete}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteCustomerMutation.isPending}
            >
              {deleteCustomerMutation.isPending ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
