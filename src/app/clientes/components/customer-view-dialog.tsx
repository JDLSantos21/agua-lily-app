// app/clientes/components/customer-view-dialog.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import { Customer, CustomerWithEquipment } from "@/types/customers.types";
import { useCustomerWithEquipment } from "@/hooks/useCustomers";
import { LoaderSpin } from "@/components/Loader";
import { useDialogStore } from "@/stores/dialogStore";
import { toast } from "sonner";
import { deleteCustomer, updateCustomerStatus } from "@/api/customers";
import { ConfirmDialog } from "@/components/ConfirmDialog";

interface CustomerViewDialogProps {
  customerId: number | null;
  onClose: () => void;
  onEdit: (customer: Customer) => void;
}

export default function CustomerViewDialog({
  customerId,
  onClose,
  onEdit,
}: CustomerViewDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);

  // Fetch customer details with equipment
  const { data, isLoading, error, refetch } = useCustomerWithEquipment(
    customerId || 0
  );
  const customer = data?.data;

  useEffect(() => {
    if (customerId) {
      setIsOpen(true);
      // Reset to details tab whenever a new customer is viewed
      setActiveTab("details");
    } else {
      setIsOpen(false);
    }
  }, [customerId]);

  const handleClose = () => {
    setIsOpen(false);
    // Allow animation to complete before fully closing
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleEdit = () => {
    if (customer) {
      onEdit(customer);
    }
  };

  const handleDelete = async () => {
    if (!customerId) return;
    setIsDeleting(true);
    try {
      await deleteCustomer(customerId);
      toast.success("Cliente eliminado exitosamente");
      handleClose();
      // Refresh the customer list
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Error al eliminar el cliente");
      }
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleStatusChange = async () => {
    if (!customer) return;

    const newStatus = customer.status === "activo" ? "inactivo" : "activo";
    setIsStatusUpdating(true);

    try {
      await updateCustomerStatus(customerId as number, newStatus);
      toast.success(`Estado del cliente actualizado a ${newStatus}`);
      refetch();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Error al actualizar el estado del cliente");
      }
    } finally {
      setIsStatusUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
          {isLoading ? (
            <LoaderSpin text="Cargando datos del cliente" />
          ) : error ? (
            <DialogDescription className="text-center text-red-500">
              Error al cargar los datos del cliente
            </DialogDescription>
          ) : customer ? (
            <>
              <DialogHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <DialogTitle className="text-xl font-bold">
                      {customer.business_name || customer.name}
                    </DialogTitle>
                    <DialogDescription className="mt-1">
                      {customer.business_name && (
                        <span className="text-gray-500">{customer.name}</span>
                      )}
                    </DialogDescription>
                  </div>
                  <Badge
                    variant={
                      customer.status === "activo" ? "outline" : "destructive"
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
                  <TabsTrigger value="equipment">
                    Equipos ({customer.current_equipment?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger value="history">Historial</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{customer.contact_phone}</span>
                    </div>

                    {customer.contact_email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          {customer.contact_email}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{customer.address}</span>
                    </div>

                    {customer.is_business && (
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Empresa</span>
                      </div>
                    )}

                    {customer.rnc && (
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">RNC: {customer.rnc}</span>
                      </div>
                    )}

                    {customer.location_reference && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-1">
                          Referencia de ubicación:
                        </h4>
                        <p className="text-sm text-gray-600">
                          {customer.location_reference}
                        </p>
                      </div>
                    )}

                    {customer.notes && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-1">Notas:</h4>
                        <p className="text-sm text-gray-600">
                          {customer.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="equipment">
                  {customer.current_equipment?.length > 0 ? (
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium">
                        Equipos asignados actualmente
                      </h3>
                      {customer.current_equipment.map((equipment) => (
                        <div
                          key={equipment.id}
                          className="border rounded-md p-3"
                        >
                          <div className="flex justify-between">
                            <div>
                              <h4 className="font-medium">
                                {equipment.type} {equipment.brand}
                              </h4>
                              <p className="text-sm text-gray-500">
                                Modelo: {equipment.model}
                              </p>
                              {equipment.serial_number && (
                                <p className="text-sm text-gray-500">
                                  Serie: {equipment.serial_number}
                                </p>
                              )}
                            </div>
                            <Badge>{equipment.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <Package className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                      <p>Este cliente no tiene equipos asignados</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="history">
                  {customer.equipment_history?.length > 0 ? (
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium">
                        Historial de asignaciones
                      </h3>
                      {customer.equipment_history.map((assignment) => (
                        <div
                          key={assignment.id}
                          className="border rounded-md p-3"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">
                                {assignment.type} {assignment.brand}
                              </h4>
                              <p className="text-xs text-gray-500">
                                Serie: {assignment.serial_number}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Asignado:{" "}
                                {new Date(
                                  assignment.assigned_date
                                ).toLocaleDateString()}
                              </p>
                              {assignment.removed_date && (
                                <p className="text-xs text-gray-500">
                                  Removido:{" "}
                                  {new Date(
                                    assignment.removed_date
                                  ).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            <Badge
                              variant={
                                assignment.removed_date
                                  ? "destructive"
                                  : "outline"
                              }
                            >
                              {assignment.removed_date ? "Removido" : "Activo"}
                            </Badge>
                          </div>
                          {assignment.notes && (
                            <p className="text-xs text-gray-600 mt-2">
                              {assignment.notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <Package className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                      <p>No hay historial de equipos para este cliente</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <DialogFooter className="flex gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={handleStatusChange}
                  disabled={isStatusUpdating}
                >
                  {isStatusUpdating
                    ? "Actualizando..."
                    : customer.status === "activo"
                      ? "Desactivar"
                      : "Activar"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleEdit}
                  className="gap-1"
                >
                  <Edit className="h-4 w-4" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Eliminar
                </Button>
              </DialogFooter>
            </>
          ) : (
            <DialogDescription className="text-center">
              No se encontró el cliente
            </DialogDescription>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Eliminar cliente"
        description="¿Está seguro que desea eliminar este cliente? Esta acción no se puede deshacer."
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}
