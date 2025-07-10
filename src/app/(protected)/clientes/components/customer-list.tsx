// src/app/clientes/components/customer-list.tsx
"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Building2,
  User,
  Trash2,
  Phone,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Customer } from "@/types/customers.types";
import { CustomerFilters } from "./customer-filters";
import { CustomerFormDialog } from "./customer-form-dialog";
import CustomerViewDialog from "./customer-view-dialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useCustomers, useDeleteCustomer } from "@/hooks/useCustomers";
import { usePagination } from "@/hooks/usePagination";
import TablePagination from "@/components/pagination";
import { CustomerFilter } from "@/types/customers.types";
import { LoaderSpin } from "@/components/Loader";
import { toast } from "sonner";

export function CustomerList() {
  // Estados para diálogos
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null
  );
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(
    null
  );
  const [filters, setFilters] = useState<CustomerFilter>({});

  // Mutaciones y consultas
  const { data, isLoading, error, refetch } = useCustomers(filters);
  const deleteCustomerMutation = useDeleteCustomer();

  // Paginación
  const itemsPerPage = 10;
  const customers = data?.data || [];
  const totalItems = data?.pagination?.total || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const { currentPage, changePage, currentData } = usePagination<Customer>(
    customers,
    itemsPerPage
  );

  // Manejadores de eventos
  const handleFilterChange = (newFilters: CustomerFilter) => {
    setFilters(newFilters);
  };

  const handleViewCustomer = (customerId: number) => {
    setSelectedCustomerId(customerId);
  };

  const handleEditCustomer = (customer: Customer) => {
    setCustomerToEdit(customer);
    setIsEditDialogOpen(true);
    // Si estaba viendo el cliente, cerrar la vista
    if (selectedCustomerId === customer.id) {
      setSelectedCustomerId(null);
    }
  };

  const handleDeleteCustomer = async (customer: Customer) => {
    setCustomerToDelete(customer);
  };

  const confirmDelete = async () => {
    if (!customerToDelete) return;

    try {
      await deleteCustomerMutation.mutateAsync(customerToDelete.id as number);
      // Recargar la lista después de eliminar
      refetch();
      toast.success("Cliente eliminado correctamente");
    } catch (error) {
      // El error ya está manejado por el hook
    } finally {
      setCustomerToDelete(null);
    }
  };

  // Si está cargando, mostrar indicador
  if (isLoading) {
    return <LoaderSpin text="Cargando clientes..." />;
  }

  // Si hay error, mostrar mensaje
  if (error) {
    return (
      <div className="text-center text-red-500 my-4">
        Error al cargar los clientes. Por favor, intente nuevamente.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Clientes</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          Nuevo Cliente
        </Button>
      </div>

      <CustomerFilters onChange={handleFilterChange} />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%]">Nombre</TableHead>
              <TableHead className="w-[25%]">Teléfono</TableHead>
              <TableHead className="w-[25%]">Tipo</TableHead>
              <TableHead className="w-[10%]">Estado</TableHead>
              <TableHead className="text-right w-[10%]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No se encontraron clientes
                </TableCell>
              </TableRow>
            ) : (
              currentData.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">
                    {customer.business_name || customer.name}
                    {customer.business_name && (
                      <div className="text-xs text-gray-500">
                        {customer.name}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 text-gray-500" />
                      {customer.contact_phone}
                    </div>
                  </TableCell>
                  <TableCell>
                    {customer.is_business ? (
                      <div className="flex items-center gap-1 text-blue-600">
                        <Building2 className="h-4 w-4" />
                        <span>Empresa</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-gray-600">
                        <User className="h-4 w-4" />
                        <span>Individual</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        customer.status === "activo" ? "outline" : "destructive"
                      }
                      className="uppercase text-xs"
                    >
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menú</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() =>
                            handleViewCustomer(customer.id as number)
                          }
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => handleEditCustomer(customer)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer text-red-600"
                          onClick={() => handleDeleteCustomer(customer)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={changePage}
        />
      )}

      {/* Diálogos */}
      <CustomerFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={refetch}
      />

      <CustomerFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        customer={customerToEdit}
        onSuccess={refetch}
      />

      <CustomerViewDialog
        customerId={selectedCustomerId}
        onClose={() => setSelectedCustomerId(null)}
        onEdit={handleEditCustomer}
      />

      <ConfirmDialog
        open={!!customerToDelete}
        title="Eliminar cliente"
        description={`¿Está seguro que desea eliminar el cliente ${customerToDelete?.name}? Esta acción no se puede deshacer.`}
        onConfirm={confirmDelete}
        onCancel={() => setCustomerToDelete(null)}
      />
    </div>
  );
}
