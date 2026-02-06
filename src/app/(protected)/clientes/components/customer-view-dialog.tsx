// src/app/clientes/components/customer-view-dialog.tsx - VERSIÓN MEJORADA
"use client";

import { useEffect, useState, useCallback, memo, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
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
  ArrowLeft,
  Eye,
  Clock,
  Wrench,
} from "lucide-react";
import {
  Customer,
  CustomerStatus,
  Equipment,
  EquipmentDocument,
} from "@/types/customers.types";
import {
  useCustomerWithEquipment,
  useDeleteCustomer,
  useUpdateCustomerStatus,
  CACHE_KEYS,
} from "@/hooks/useCustomers";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { format } from "@formkit/tempo";
import { RoleBased } from "@/components/RoleBased";
import { IoLogoWhatsapp } from "react-icons/io5";
import formatPhoneNumber from "@/shared/utils/formatNumber";
import { getStatusColor, getStatusText } from "../../activos/equipments/utils";
import {
  getReadUrl,
  getPresignedUrl,
  confirmUpload,
  deleteFile,
} from "@/api/storage";
import { toast } from "sonner";
import { open } from "@tauri-apps/plugin-shell";
import { Loader2, Upload, X } from "lucide-react";
import axios from "axios";
import { confirm } from "@tauri-apps/plugin-dialog";

// Estructura de pestañas para ver un cliente
const TABS = [
  {
    id: "details",
    title: "Información",
    icon: User,
    description: "Detalles del cliente",
  },
  {
    id: "equipment",
    title: "Equipos",
    icon: Wrench,
    description: "Equipos asignados",
  },
  {
    id: "history",
    title: "Historial",
    icon: Clock,
    description: "Historial de equipos",
  },
];

interface CustomerViewDialogProps {
  customerId: number;
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
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch customer details with equipment
  const { data, isLoading, error, refetch } =
    useCustomerWithEquipment(customerId);

  const deleteCustomerMutation = useDeleteCustomer();

  const customer = data?.data;

  // Status update mutation
  const updateStatusMutation = useUpdateCustomerStatus();

  // Effect para controlar la apertura/cierre del diálogo
  useEffect(() => {
    if (customerId) {
      setIsOpen(true);
      setCurrentTab(0); // Reset a la pestaña de detalles
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
    }
  }, [customer, onEdit]);

  const handleDelete = useCallback(() => {
    if (customer?.id) {
      deleteCustomerMutation.mutate(customer.id, {
        onSuccess: () => {
          setShowDeleteConfirm(false);
        },
        onError: (error: any) => {
          console.log("Error al eliminar el cliente:", error);
        },
      });
      handleClose();
    }
  }, [customer, handleClose]);

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
      },
    );
  }, [customer, customerId, updateStatusMutation, refetch]);

  const handleUploadSuccess = useCallback(async () => {
    // 1. Invalidar caché de clientes para actualizar listas
    await queryClient.invalidateQueries({ queryKey: CACHE_KEYS.all });
    // 2. Refrescar datos del cliente actual
    refetch();
  }, [queryClient, refetch]);

  // Si el diálogo no está abierto, no renderizar nada
  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent
          aria-describedby={undefined}
          className="sm:max-w-4xl max-h-[95vh] overflow-hidden flex flex-col"
        >
          {isLoading ? (
            <>
              <DialogTitle className="sr-only">
                Cargando detalles del cliente
              </DialogTitle>
              <CustomerViewSkeleton />
            </>
          ) : error ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <DialogTitle className="sr-only">Error de carga</DialogTitle>
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
              <DialogHeader className="border-b border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleClose}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                    <Eye className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <DialogTitle className="text-xl font-semibold flex items-center gap-3">
                      {customer.business_name || customer.name}
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                      {customer.business_name && customer.name}
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

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{formatPhoneNumber(customer.contact_phone)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span className="truncate max-w-xs">
                          {customer.address}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Wrench className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">
                        {customer.current_equipments?.length || 0} equipos
                      </span>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              {/* Stepper compacto */}
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded-xl">
                {TABS.map((tab, index) => {
                  const isActive = index === currentTab;
                  const isCompleted = index < currentTab;
                  const Icon = tab.icon;

                  return (
                    <div key={tab.id} className="flex items-center flex-1">
                      <div className="flex items-center gap-3 w-full">
                        <button
                          onClick={() => setCurrentTab(index)}
                          className={cn(
                            "flex items-center justify-center w-8 h-8 rounded-lg border transition-all duration-200",
                            isActive
                              ? "bg-blue-500 border-blue-500 text-white shadow-sm"
                              : "bg-white border-gray-200 text-gray-400 hover:border-gray-300",
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </button>
                        <div className="hidden sm:block">
                          <p
                            className={cn(
                              "text-sm font-medium",
                              isActive ? "text-blue-600" : "text-gray-500",
                            )}
                          >
                            {tab.title}
                          </p>
                        </div>
                      </div>
                      {index < TABS.length - 1 && (
                        <div
                          className={cn(
                            "flex-1 h-px mx-3 transition-colors duration-300",
                            isCompleted ? "bg-blue-500" : "bg-gray-200",
                          )}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Contenido con animaciones */}
              <div className="flex-1 overflow-y-auto">
                <div className="space-y-6 p-1">
                  {/* Tab 0: Información */}
                  {currentTab === 0 && (
                    <div className="animate-in slide-in-from-right-5 duration-300">
                      <CustomerDetailTab customer={customer} />
                    </div>
                  )}

                  {/* Tab 1: Equipos */}
                  {currentTab === 1 && (
                    <div className="animate-in slide-in-from-right-5 duration-300">
                      <CustomerEquipmentTab
                        equipment={customer.current_equipments}
                        onUploadSuccess={handleUploadSuccess}
                      />
                    </div>
                  )}

                  {/* Tab 2: Historial */}
                  {currentTab === 2 && (
                    <div className="animate-in slide-in-from-right-5 duration-300">
                      <CustomerHistoryTab
                        history={customer.equipment_history}
                        onUploadSuccess={handleUploadSuccess}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Footer con botones de acción mejorados */}
              <DialogFooter className="pt-6 border-t border-gray-100 flex justify-center items-center">
                <div className="flex justify-between items-center w-full gap-4">
                  <div className="flex items-center justify-between gap-3 w-full">
                    <span className="text-sm text-gray-500">
                      Vista {currentTab + 1} de {TABS.length}
                    </span>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={handleStatusChange}
                        disabled={updateStatusMutation.isPending}
                        className="gap-2 px-4"
                      >
                        {updateStatusMutation.isPending ? (
                          "Actualizando..."
                        ) : customer.status === CustomerStatus.ACTIVE ? (
                          <>
                            <XCircle className="h-4 w-4" />
                            Desactivar
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            Activar
                          </>
                        )}
                      </Button>

                      <RoleBased
                        allowedRoles={["admin", "administrativo", "supervisor"]}
                      >
                        <Button
                          onClick={handleEdit}
                          className="gap-2 px-4 bg-blue-600 hover:bg-blue-700"
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
                            className="gap-2 px-4"
                          >
                            <Trash2 className="h-4 w-4" />
                            Eliminar
                          </Button>
                        )}
                      </RoleBased>
                    </div>
                  </div>
                </div>
              </DialogFooter>
            </>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <DialogTitle className="sr-only">
                Cliente no encontrado
              </DialogTitle>
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

const DocumentItem = memo(function DocumentItem({
  doc,
  onDelete,
}: {
  doc: EquipmentDocument;
  onDelete: () => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const { signedUrl } = await getReadUrl(doc.file_key);
      await open(signedUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Error al abrir el documento");
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    const confirmed = await confirm(`¿Eliminar "${doc.original_name}"?`);

    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await deleteFile(doc.file_key);
      toast.success("Documento eliminado correctamente");
      onDelete();
    } catch (error: any) {
      console.error("Error deleting file:", error);
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        toast.error(`Error: ${error.response.data.error}`);
      } else {
        toast.error("Error al eliminar el documento");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="inline-flex items-center gap-1 bg-white text-gray-700 text-xs font-medium rounded-md border border-gray-200 shadow-sm">
      <button
        onClick={handleDownload}
        className="inline-flex items-center px-3 py-1.5 hover:bg-gray-50 transition-colors duration-200 rounded-l-md"
        title={`Ver ${doc.original_name}`}
      >
        <FileText className="h-3.5 w-3.5 mr-2 text-blue-600" />
        <span className="truncate max-w-[150px]">{doc.original_name}</span>
      </button>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="px-2 py-1.5 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 rounded-r-md border-l border-gray-200 disabled:opacity-50"
        title="Eliminar documento"
      >
        {isDeleting ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <X className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  );
});

const FileUploadButton = ({
  assignmentId,
  onSuccess,
}: {
  assignmentId: number;
  onSuccess: () => void;
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("El archivo excede el límite de 10MB");
      return;
    }

    setIsUploading(true);
    try {
      // Asegurar que tenemos un tipo MIME, si no, usar genérico
      const contentType = file.type || "application/octet-stream";
      // Truncar nombre si es muy largo (ej. > 200 caracteres) para evitar error BD
      const fileName =
        file.name.length > 200
          ? file.name.substring(0, 190) +
            "." +
            (file.name.split(".").pop() || "bin")
          : file.name;

      // 1. Obtener URL prefirmada
      const { signedUrl, key } = await getPresignedUrl(
        fileName,
        contentType,
        assignmentId,
      );

      // 2. Subir archivo a R2/S3
      await axios.put(signedUrl, file, {
        headers: {
          "Content-Type": contentType,
        },
      });

      // 3. Confirmar subida en backend
      await confirmUpload(assignmentId, key, fileName, contentType, file.size);

      toast.success("Documento subido correctamente");
      onSuccess();
    } catch (error: any) {
      console.error("Error uploading file:", error);
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        toast.error(`Error: ${error.response.data.error}`);
      } else {
        toast.error("Error al subir el documento");
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        onClick={handleFileClick}
        disabled={isUploading}
        className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-md hover:bg-blue-100 transition-colors duration-200"
      >
        {isUploading ? (
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
        ) : (
          <Upload className="h-3 w-3 mr-1" />
        )}
        {isUploading ? "Subiendo..." : "Subir doc"}
      </button>
    </>
  );
};

// Componente auxiliar para mostrar información
const InfoCard = memo(function InfoCard({
  icon: Icon,
  label,
  value,
  valueClassName = "text-gray-800",
  labelClassName = "text-gray-600",
  extra,
}: {
  icon: any;
  label: string;
  value: string;
  valueClassName?: string;
  labelClassName?: string;
  extra?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 text-gray-400 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className={`text-xs ${labelClassName}`}>{label}</p>
        <p className={`text-sm font-medium ${valueClassName} truncate`}>
          {value}
        </p>
      </div>
      {extra && <div className="flex-shrink-0">{extra}</div>}
    </div>
  );
});

// Componentes internos memoizados para evitar re-renders innecesarios
const CustomerDetailTab = memo(function CustomerDetailTab({
  customer,
}: {
  customer: Customer;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información de contacto */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Información de Contacto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <InfoCard
                icon={Phone}
                label="Teléfono"
                value={formatPhoneNumber(customer.contact_phone)}
                extra={
                  <IoLogoWhatsapp
                    className={`${customer.has_whatsapp ? "text-green-600" : "text-gray-300"} w-4 h-4`}
                  />
                }
              />

              {customer.contact_email && (
                <InfoCard
                  icon={Mail}
                  label="Email"
                  value={customer.contact_email}
                  valueClassName="break-all"
                />
              )}

              <InfoCard
                icon={MapPin}
                label="Dirección"
                value={customer.address}
              />
            </div>
          </CardContent>
        </Card>

        {/* Información del negocio */}
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
              {customer.is_business ? (
                <>
                  <Building2 className="h-5 w-5" />
                  Información del Negocio
                </>
              ) : (
                <>
                  <User className="h-5 w-5" />
                  Información Personal
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <InfoCard
                icon={customer.is_business ? Building2 : User}
                label="Tipo"
                value={customer.is_business ? "Empresa" : "Individual"}
                valueClassName={
                  customer.is_business ? "text-blue-600" : "text-gray-600"
                }
              />

              {customer.rnc && (
                <InfoCard icon={FileText} label="RNC" value={customer.rnc} />
              )}

              <InfoCard
                icon={Calendar}
                label="Cliente desde"
                value={format(customer.created_at, "long")}
                valueClassName="text-sm text-gray-500"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notas y referencias */}
      {(customer.location_reference || customer.notes) && (
        <div className="space-y-4">
          {customer.location_reference && (
            <Card className="border-blue-200 bg-blue-50/50 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium text-blue-700 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Referencia de ubicación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-600 leading-relaxed">
                  {customer.location_reference}
                </p>
              </CardContent>
            </Card>
          )}

          {customer.notes && (
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium text-gray-700 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Notas adicionales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {customer.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
});

const CustomerEquipmentTab = memo(function CustomerEquipmentTab({
  equipment = [],
  onUploadSuccess,
}: {
  equipment?: Equipment[];
  onUploadSuccess: () => void;
}) {
  if (equipment.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-xl mx-auto mb-4">
          <Package className="h-8 w-8 text-gray-300" />
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          Sin equipos asignados
        </h3>
        <p className="text-sm text-gray-500">
          Este cliente no tiene equipos asignados actualmente
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header con resumen */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-lg">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Equipos Asignados</h3>
              <p className="text-sm text-gray-600">
                {equipment.length}{" "}
                {equipment.length === 1 ? "equipo activo" : "equipos activos"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de equipos */}
      <div className="space-y-3">
        {equipment.map((item) => (
          <Card
            key={item.id}
            className="border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0">
                      <Wrench className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {item.type.toUpperCase()} {item.brand.toUpperCase()}
                      </h4>
                      <p className="text-sm text-gray-500 mb-2">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {item.serial_number && (
                          <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-md">
                            Serial: {item.serial_number}
                          </span>
                        )}
                      </div>

                      {item.assigned_date && (
                        <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Asignado el {format(item.assigned_date, "long")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Estado */}
                <div className="ml-4 flex-shrink-0">
                  <Badge
                    variant="outline"
                    className={`text-sm font-medium ${getStatusColor(item.status)}`}
                  >
                    {getStatusText(item.status)}
                  </Badge>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-start justify-between">
                <div>
                  <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 w-full">
                    Documentos de la Asignación
                  </h5>
                  {item.documents && item.documents.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {item.documents.map((doc) => (
                        <DocumentItem
                          key={doc.id}
                          doc={doc}
                          onDelete={onUploadSuccess}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-md border border-red-100 mb-2">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <p className="text-sm font-medium">
                        Esta asignación no tiene documentos cargados.
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <FileUploadButton
                    assignmentId={item.assignment_id}
                    onSuccess={onUploadSuccess}
                  />
                </div>
              </div>

              {item.notes && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg border-t">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
});

const CustomerHistoryTab = memo(function CustomerHistoryTab({
  history = [],
  onUploadSuccess,
}: {
  history?: Equipment[];
  onUploadSuccess: () => void;
}) {
  if (history.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-xl mx-auto mb-4">
          <Clock className="h-8 w-8 text-gray-300" />
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          Sin historial
        </h3>
        <p className="text-sm text-gray-500">
          No hay historial de equipos para este cliente
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-lg">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              Historial de Equipos
            </h3>
            <p className="text-sm text-gray-600">
              {history.length}{" "}
              {history.length === 1
                ? "asignación registrada"
                : "asignaciones registradas"}
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Línea temporal */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-300 to-gray-300" />

        <div className="space-y-6">
          {history.map((item, index) => {
            const isActive = !item.removed_date;

            return (
              <div key={item.id} className="relative">
                {/* Punto en la timeline */}
                <div
                  className={cn(
                    "absolute left-0 w-12 h-12 rounded-xl shadow-lg flex items-center justify-center",
                    isActive ? "bg-blue-500" : "bg-gray-400",
                  )}
                >
                  <Wrench className="h-5 w-5 text-white" />
                </div>

                {/* Contenido */}
                <div className="ml-16">
                  <Card
                    className={cn(
                      "border-l-4 shadow-sm transition-all duration-200 hover:shadow-md",
                      isActive
                        ? "border-l-blue-500 bg-blue-50/50"
                        : "border-l-gray-400 bg-gray-50/50",
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-base flex items-center gap-2">
                            {item.type.toUpperCase()} {item.brand.toUpperCase()}
                            <Badge
                              variant={isActive ? "outline" : "secondary"}
                              className="text-xs"
                            >
                              {isActive ? "Activo" : "Removido"}
                            </Badge>
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {item.description}
                          </p>
                          {item.serial_number && (
                            <p className="text-sm text-gray-500">
                              Serial: {item.serial_number}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Fechas */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                        {item.assigned_date && (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                            <span>
                              Asignado: {format(item.assigned_date, "long")}
                            </span>
                          </div>
                        )}
                        {item.removed_date && (
                          <div className="flex items-center gap-1">
                            <XCircle className="h-4 w-4 text-red-500" />
                            <span>
                              Removido: {format(item.removed_date, "long")}
                            </span>
                          </div>
                        )}
                      </div>

                      {item.documents && item.documents.length > 0 && (
                        <div className="mb-3 mt-3 pt-3 border-t border-gray-100">
                          <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            Documentos Asociados
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {item.documents.map((doc) => (
                              <DocumentItem
                                key={doc.id}
                                doc={doc}
                                onDelete={onUploadSuccess}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Notas */}
                      {item.notes && (
                        <div className="p-3 bg-white rounded-lg border border-gray-200">
                          <p className="text-sm text-gray-700 leading-relaxed flex items-start gap-2">
                            <FileText className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            {item.notes}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

// Componente de skeleton para los estados de carga
const CustomerViewSkeleton = () => (
  <div className="space-y-4">
    {/* Header skeleton */}
    <div className="flex items-center gap-3 mb-4">
      <Skeleton className="h-8 w-8 rounded-lg" />
      <Skeleton className="h-10 w-10 rounded-xl" />
      <div className="flex-1">
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>

    {/* Summary card skeleton */}
    <Skeleton className="h-20 w-full rounded-xl" />

    {/* Tabs skeleton */}
    <div className="flex justify-between items-center p-2 bg-gray-50 rounded-xl">
      {Array(3)
        .fill(null)
        .map((_, i) => (
          <div key={i} className="flex items-center gap-3 flex-1">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="hidden sm:block">
              <Skeleton className="h-4 w-16" />
            </div>
            {i < 2 && <div className="flex-1 h-px bg-gray-200 mx-3" />}
          </div>
        ))}
    </div>

    {/* Content skeleton */}
    <div className="space-y-6 p-1">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array(2)
          .fill(null)
          .map((_, i) => (
            <div key={i} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-5 w-32" />
              </div>
              {Array(3)
                .fill(null)
                .map((_, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <Skeleton className="h-4 w-4 rounded" />
                    <div className="flex-1">
                      <Skeleton className="h-3 w-16 mb-1" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
            </div>
          ))}
      </div>
    </div>

    {/* Footer skeleton */}
    <div className="flex justify-between items-center pt-6 border-t border-gray-100">
      <Skeleton className="h-4 w-24" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  </div>
);

export default CustomerViewDialog;
