// src/app/clientes/components/customer-view-dialog.tsx - VERSIÓN MEJORADA
"use client";

import { useEffect, useState, useCallback, memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Building2,
  User,
  FileText,
  Package,
  AlertCircle,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Customer, CustomerStatus, Equipment } from "@/types/customers.types";
import {
  useCustomerWithEquipment,
  useUpdateCustomerStatus,
} from "@/hooks/useCustomers";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { format } from "@formkit/tempo";
import { RoleBased } from "@/components/RoleBased";
// import { formatDate } from "@/lib/utils"; // Suponiendo que existe esta función de utilidad

interface CustomerViewDialogProps {
  customerId: number | null;
  onClose: () => void;
  onEdit: (customer: Customer) => void;
  onDelete?: (customer: Customer) => void;
}

const CustomerViewDialog = memo(function CustomerViewDialog({
  customerId,
  onClose,
  onEdit,
  onDelete,
}: CustomerViewDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch customer details with equipment
  const { data, isLoading, error, refetch } = useCustomerWithEquipment(
    customerId || 0
  );

  const customer = data?.data;

  // Status update mutation
  const updateStatusMutation = useUpdateCustomerStatus();

  // Effect para controlar la apertura/cierre del diálogo
  useEffect(() => {
    if (customerId) {
      setIsOpen(true);
      setActiveTab("details"); // Reset a la pestaña de detalles
    } else {
      setIsOpen(false);
    }
  }, [customerId]);

  // Handlers
  const handleClose = useCallback(() => {
    setIsOpen(false);
    // Permitir que la animación termine antes de cerrar completamente
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  const handleEdit = useCallback(() => {
    if (customer) {
      onEdit(customer);
      // Opcionalmente cerrar el diálogo al editar
      // handleClose();
    }
  }, [customer, onEdit]);

  const handleDelete = useCallback(() => {
    if (customer && onDelete) {
      onDelete(customer);
      handleClose();
    }
  }, [customer, onDelete, handleClose]);

  const handleStatusChange = useCallback(() => {
    if (!customer) return;

    const newStatus =
      customer.status === CustomerStatus.ACTIVE
        ? CustomerStatus.INACTIVE
        : CustomerStatus.ACTIVE;

    updateStatusMutation.mutate(
      {
        id: customerId as number,
        status: newStatus,
      },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  }, [customer, customerId, updateStatusMutation, refetch]);

  // Si el diálogo no está abierto, no renderizar nada
  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
          <DialogTitle hidden />
          {isLoading ? (
            <CustomerViewSkeleton />
          ) : error ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <DialogDescription className="text-red-500 text-lg">
                Error al cargar los datos del cliente
              </DialogDescription>
              <Button variant="outline" onClick={handleClose} className="mt-4">
                Cerrar
              </Button>
            </div>
          ) : customer ? (
            <>
              <DialogHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <DialogTitle className="text-xl font-bold line-clamp-1">
                      {customer.business_name || customer.name}
                    </DialogTitle>
                    <DialogDescription className="mt-1">
                      {customer.business_name && (
                        <span className="text-gray-500 line-clamp-1">
                          {customer.name}
                        </span>
                      )}
                    </DialogDescription>
                  </div>
                  <Badge
                    variant={
                      customer.status === CustomerStatus.ACTIVE
                        ? "outline"
                        : "destructive"
                    }
                    className="uppercase text-xs"
                  >
                    {customer.status}
                  </Badge>
                </div>
              </DialogHeader>

              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="mt-2"
              >
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="details">Detalles</TabsTrigger>
                  <TabsTrigger
                    value="equipment"
                    className="flex items-center gap-1"
                  >
                    Equipos
                    <span className="inline-flex items-center justify-center rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                      {customer.current_equipment?.length || 0}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="history">Historial</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <CustomerDetailTab customer={customer} />
                </TabsContent>

                <TabsContent value="equipment">
                  <CustomerEquipmentTab
                    equipment={customer.current_equipment}
                  />
                </TabsContent>

                <TabsContent value="history">
                  <CustomerHistoryTab history={customer.equipment_history} />
                </TabsContent>
              </Tabs>

              <DialogFooter className="flex flex-wrap sm:flex-nowrap gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={handleStatusChange}
                  disabled={updateStatusMutation.isPending}
                  className="w-full sm:w-auto"
                >
                  {updateStatusMutation.isPending ? (
                    "Actualizando..."
                  ) : customer.status === CustomerStatus.ACTIVE ? (
                    <>
                      <XCircle className="mr-2 h-4 w-4" />
                      Desactivar
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Activar
                    </>
                  )}
                </Button>
                <RoleBased
                  allowedRoles={["admin", "administrativo", "supervisor"]}
                >
                  <Button
                    variant="outline"
                    onClick={handleEdit}
                    className="gap-1 w-full sm:w-auto"
                  >
                    <Edit className="h-4 w-4" />
                    Editar
                  </Button>
                </RoleBased>
                <RoleBased
                  allowedRoles={["admin", "administrativo", "supervisor"]}
                >
                  {onDelete && (
                    <Button
                      variant="destructive"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="gap-1 w-full sm:w-auto"
                    >
                      <Trash2 className="h-4 w-4" />
                      Eliminar
                    </Button>
                  )}
                </RoleBased>
              </DialogFooter>
            </>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <AlertCircle className="h-12 w-12 text-amber-500 mb-4" />
              <DialogDescription className="text-gray-500">
                No se encontró información del cliente
              </DialogDescription>
              <Button variant="outline" onClick={handleClose} className="mt-4">
                Cerrar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Eliminar cliente"
        description={`¿Está seguro que desea eliminar a ${customer?.name || "este cliente"}? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
});

// Componentes internos memoizados para evitar re-renders innecesarios
const CustomerDetailTab = memo(function CustomerDetailTab({
  customer,
}: {
  customer: Customer;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Phone className="h-4 w-4 text-gray-500" />
        <span className="text-sm">{customer.contact_phone}</span>
      </div>

      {customer.contact_email && (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-500" />
          <span className="text-sm break-all">{customer.contact_email}</span>
        </div>
      )}

      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-gray-500" />
        <span className="text-sm">{customer.address}</span>
      </div>

      <div className="flex items-center gap-2">
        {customer.is_business ? (
          <>
            <Building2 className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-blue-500">Empresa</span>
          </>
        ) : (
          <>
            <User className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Individual</span>
          </>
        )}
      </div>

      {customer.rnc && (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-gray-500" />
          <span className="text-sm">RNC: {customer.rnc}</span>
        </div>
      )}

      {customer.location_reference && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-1">Referencia de ubicación:</h4>
          <p className="text-sm text-gray-600">{customer.location_reference}</p>
        </div>
      )}

      {customer.notes && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-1">Notas:</h4>
          <p className="text-sm text-gray-600">{customer.notes}</p>
        </div>
      )}

      {customer.created_at && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-400">
          <Calendar className="h-3 w-3" />
          <span>Cliente desde {format(customer.created_at, "long")}</span>
        </div>
      )}
    </div>
  );
});

const CustomerEquipmentTab = memo(function CustomerEquipmentTab({
  equipment = [],
}: {
  equipment?: Equipment[];
}) {
  if (equipment.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Package className="h-12 w-12 mx-auto text-gray-300 mb-2" />
        <p>Este cliente no tiene equipos asignados</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Equipos asignados actualmente</h3>
      {equipment.map((item) => (
        <div
          key={item.id}
          className="border rounded-md p-3 hover:bg-gray-50 transition-colors"
        >
          <div className="flex justify-between">
            <div>
              <h4 className="font-medium">
                {item.type} {item.brand}
              </h4>
              <p className="text-sm text-gray-500">Modelo: {item.model}</p>
              {item.serial_number && (
                <p className="text-sm text-gray-500">
                  Serie: {item.serial_number}
                </p>
              )}
              {item.assigned_date && (
                <p className="text-xs text-gray-400 mt-1">
                  Asignado: {format(item.assigned_date, "long")}
                </p>
              )}
            </div>
            <Badge>{item.status}</Badge>
          </div>
          {item.notes && (
            <p className="text-xs text-gray-500 mt-2 border-t pt-2">
              {item.notes}
            </p>
          )}
        </div>
      ))}
    </div>
  );
});

const CustomerHistoryTab = memo(function CustomerHistoryTab({
  history = [],
}: {
  history?: Equipment[];
}) {
  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Package className="h-12 w-12 mx-auto text-gray-300 mb-2" />
        <p>No hay historial de equipos para este cliente</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Historial de asignaciones</h3>
      {history.map((item) => (
        <div
          key={item.id}
          className="border rounded-md p-3 hover:bg-gray-50 transition-colors"
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">
                {item.type} {item.brand}
              </h4>
              <p className="text-xs text-gray-500">
                Serie: {item.serial_number}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Asignado: {format(item.assigned_date || "", "long")}
              </p>
              {item.removed_date && (
                <p className="text-xs text-gray-500">
                  Removido: {format(item.removed_date, "long")}
                </p>
              )}
            </div>
            <Badge variant={item.removed_date ? "destructive" : "outline"}>
              {item.removed_date ? "Removido" : "Activo"}
            </Badge>
          </div>
          {item.notes && (
            <p className="text-xs text-gray-600 mt-2 border-t pt-2">
              {item.notes}
            </p>
          )}
        </div>
      ))}
    </div>
  );
});

// Componente de skeleton para los estados de carga
const CustomerViewSkeleton = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-start">
      <div>
        <Skeleton className="h-7 w-48 mb-2" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-6 w-20" />
    </div>

    <div className="space-y-6">
      <Skeleton className="h-10 w-full" />

      <div className="space-y-3">
        {Array(5)
          .fill(null)
          .map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-48" />
            </div>
          ))}
      </div>

      <div className="mt-4">
        <Skeleton className="h-5 w-32 mb-2" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>

    <div className="flex justify-end gap-2 pt-4">
      <Skeleton className="h-9 w-24" />
      <Skeleton className="h-9 w-24" />
      <Skeleton className="h-9 w-24" />
    </div>
  </div>
);

export default CustomerViewDialog;
