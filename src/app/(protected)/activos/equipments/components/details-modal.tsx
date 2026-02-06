import { RoleBased } from "@/components/RoleBased";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useDeleteEquipmentMutation,
  useEquipment,
  useGPSUpdateMutation,
  useShowInMobileMutation,
  useUpdateEquipmentMutation,
} from "@/hooks/useEquipments";
import formatPhoneNumber from "@/shared/utils/formatNumber";
import { Equipment } from "@/types/equipments.types";
import { confirm } from "@tauri-apps/plugin-dialog";
import { AxiosError } from "axios";
import {
  CalendarDays,
  MapPin,
  Wrench,
  User,
  Phone,
  X,
  EllipsisVertical,
  UserMinus,
  Users,
  Package,
  Loader2,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { getStatusColor, getStatusText } from "../utils";
import { printerService } from "@/services/printService";
import { useState, useEffect, memo } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import AssignCustomerModal from "./assign-customer-modal";
import RemoveAssignmentModal from "./remove-assignment-modal";

import { CiGps, CiMobile3 } from "react-icons/ci";

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment: Equipment | null;
  equipment_id: number | null;
}

interface EditEquipmentForm {
  notes: string;
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return "No registrado";
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const EquipmentDetailsModal = memo(function EquipmentDetailsModal({
  isOpen,
  onClose,
  equipment_id,
}: DetailsModalProps) {
  const { data: equipmentData, isLoading: isEquipmentLoading } = useEquipment(
    isOpen && equipment_id ? equipment_id : null,
  );

  const equipment = equipmentData?.data;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditEquipmentForm>({
    defaultValues: {
      notes: equipment?.notes || "",
    },
  });

  const { mutateAsync: updateEquipment, isPending: isUpdatePending } =
    useUpdateEquipmentMutation();
  const { mutateAsync: deleteEquipment, isPending: isDeletePending } =
    useDeleteEquipmentMutation();
  const { mutateAsync: showInMobile, isPending: isShowInMobilePending } =
    useShowInMobileMutation();
  const { mutateAsync: setGPSUpdate, isPending: isGPSUpdatePending } =
    useGPSUpdateMutation();
  const [isEditing, setIsEditing] = useState(false);

  // Estados para los modales de asignación
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);

  // Resetear el estado de edición cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setIsEditing(false);
      reset();
    }
  }, [isOpen, reset]);

  useEffect(() => {
    if (equipment) {
      reset({
        notes: equipment.notes || "",
      });
    }
  }, [equipment, reset]);

  const onSubmitEdit = async (data: EditEquipmentForm) => {
    try {
      await updateEquipment({
        id: equipment!.id,
        data: { notes: data.notes },
      });
      equipment!.notes = data.notes;
    } catch (error) {
      console.log("Error updating equipment:", error);
    } finally {
      setIsEditing(false);
      reset();
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      reset(); // Resetear el formulario si se cancela
    }
    setIsEditing(!isEditing);
  };

  // Handlers para los modales de asignación
  const handleAssignModal = () => {
    setAssignModalOpen(true);
  };

  const handleRemoveModal = () => {
    setRemoveModalOpen(true);
  };

  const handleModalSuccess = () => {
    console.log("Success");
  };
  const handleDelete = async (id: number) => {
    const confirmed = await confirm(
      "¿Estás seguro de que deseas eliminar este equipo? Esta acción no se puede deshacer.",
      {
        title: "Confirmar Eliminación",
        kind: "warning",
        cancelLabel: "Cancelar",
        okLabel: "Eliminar",
      },
    );

    if (confirmed) {
      try {
        await deleteEquipment(id);
        onClose();
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.error || "Error al eliminar el equipo",
          );
        } else {
          toast.error("Ocurrió un problema al eliminar el equipo.");
        }
      }
    }
  };

  const handlePrintLabel = async (equipment: Equipment) => {
    const isConfirmed = await confirm(
      "¿Deseas imprimir la etiqueta del equipo?",
      {
        cancelLabel: "Cancelar",
        okLabel: "Imprimir",
        kind: "info",
        title: "Confirmar impresión",
      },
    );

    if (isConfirmed) {
      const response = await printerService.printEquipmentLabel(equipment);
      if (response.success) {
        toast.success("Etiqueta impresa correctamente.");
      } else {
        toast.error("Ocurrió un problema al imprimir la etiqueta.");
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        aria-describedby={undefined}
        className="max-w-4xl max-h-[90vh] overflow-hidden p-0 [&>button]:hidden"
      >
        {isEquipmentLoading || !equipment ? (
          <div className="flex items-center justify-center h-48">
            <DialogTitle className="sr-only">Cargando detalles</DialogTitle>
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            <div className="bg-white border-b px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-xl font-semibold text-gray-900">
                    {isEditing ? "Editar" : "Detalles del"} Equipo #
                    {equipment.id}
                  </DialogTitle>
                  <p className="text-gray-600 text-sm mt-1">
                    {equipment.brand} {equipment.model}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {equipment.show_in_mobile ? (
                    <Badge variant="outline">
                      <Eye className="w-4 h-4 mr-2" /> Marcado como visible en
                      la app
                    </Badge>
                  ) : null}

                  {!equipment.require_gps_update &&
                  equipment.location_created_at ? (
                    <Badge variant="standardTrip">GPS Actualizado</Badge>
                  ) : equipment.require_gps_update ? (
                    <Badge variant="destructive">
                      Actualización GPS Pendiente
                    </Badge>
                  ) : null}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative hover:bg-gray-100 transition-colors"
                      >
                        <EllipsisVertical className="h-5 w-5 text-gray-600" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-64 p-2"
                      align="end"
                      sideOffset={8}
                    >
                      <div className="flex flex-col gap-1">
                        {/* Header del popover */}
                        <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide border-b border-gray-100 mb-1">
                          Acciones del Equipo
                        </div>

                        {/* Opción de editar */}
                        <button
                          onClick={() => setIsEditing(true)}
                          className="hover:bg-blue-50 w-full text-left px-3 py-2.5 rounded-md text-sm text-gray-700 flex items-center gap-3 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <Wrench className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">Editar equipo</div>
                            <div className="text-xs text-gray-500">
                              Modificar información y notas
                            </div>
                          </div>
                        </button>

                        <button
                          onClick={() =>
                            showInMobile({
                              id: equipment.id,
                              show: !equipment.show_in_mobile,
                            })
                          }
                          className="hover:bg-blue-50 w-full text-left px-3 py-2.5 rounded-md text-sm text-gray-700 flex items-center gap-3 transition-colors group"
                          disabled={isShowInMobilePending}
                        >
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            {isShowInMobilePending ? (
                              <Loader2 className="animate-spin h-4 w-5 text-blue-600" />
                            ) : (
                              <CiMobile3 className="h-4 w-4 text-blue-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">
                              {equipment.show_in_mobile
                                ? "Ocultar en la App"
                                : "Mostrar en la App"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {equipment.show_in_mobile ? "Ocultar" : "Mostrar"}{" "}
                              este equipo en la aplicación movil
                            </div>
                          </div>
                        </button>

                        <button
                          onClick={() =>
                            setGPSUpdate({
                              id: equipment.id,
                              need_update: !equipment.require_gps_update,
                            })
                          }
                          className="hover:bg-blue-50 w-full text-left px-3 py-2.5 rounded-md text-sm text-gray-700 flex items-center gap-3 transition-colors group"
                          disabled={isGPSUpdatePending}
                        >
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            {isGPSUpdatePending ? (
                              <Loader2 className="animate-spin h-4 w-5 text-blue-600" />
                            ) : (
                              <CiGps className="h-4 w-4 text-blue-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">
                              {!equipment.require_gps_update
                                ? "Solicitar actualización de GPS"
                                : "Cancelar Solicitud GPS"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {!equipment.require_gps_update
                                ? "Enviar solicitud de actualización de GPS"
                                : "Cancelar solicitud de actualización de GPS"}
                            </div>
                          </div>
                        </button>

                        {/* Opción de asignar cliente */}
                        {!equipment.current_customer_id && (
                          <button
                            onClick={handleAssignModal}
                            className="hover:bg-green-50 w-full text-left px-3 py-2.5 rounded-md text-sm text-gray-700 flex items-center gap-3 transition-colors group"
                            disabled={!!equipment.current_customer_id}
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                equipment.current_customer_id
                                  ? "bg-gray-100"
                                  : "bg-green-100 group-hover:bg-green-200"
                              }`}
                            >
                              <Users
                                className={`h-4 w-4 ${
                                  equipment.current_customer_id
                                    ? "text-gray-400"
                                    : "text-green-600"
                                }`}
                              />
                            </div>
                            <div className="flex-1">
                              <div
                                className={`font-medium ${
                                  equipment.current_customer_id
                                    ? "text-gray-400"
                                    : "text-gray-900"
                                }`}
                              >
                                {equipment.current_customer_id
                                  ? "Ya tiene cliente"
                                  : "Asignar cliente"}
                              </div>
                              <div className="text-xs text-gray-500">
                                {equipment.current_customer_id
                                  ? "El equipo ya está asignado"
                                  : "Asignar equipo a un cliente"}
                              </div>
                            </div>
                          </button>
                        )}

                        {/* Opción de quitar asignación */}
                        {/* Opción de remover cliente (solo si tiene cliente) */}
                        {equipment.current_customer_id && (
                          <button
                            onClick={handleRemoveModal}
                            className="hover:bg-red-50 w-full text-left px-3 py-2.5 rounded-md text-sm text-gray-700 flex items-center gap-3 transition-colors group"
                          >
                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                              <UserMinus className="h-4 w-4 text-red-600" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">
                                Remover cliente
                              </div>
                              <div className="text-xs text-gray-500">
                                Quitar asignación del cliente actual
                              </div>
                            </div>
                          </button>
                        )}

                        {/* Separador */}
                        <div className="my-1 border-t border-gray-200" />

                        {/* Opción de imprimir etiqueta */}
                        <button
                          onClick={() => handlePrintLabel(equipment)}
                          className="hover:bg-purple-50 w-full text-left px-3 py-2.5 rounded-md text-sm text-gray-700 flex items-center gap-3 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                            <Package className="h-4 w-4 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">Imprimir etiqueta</div>
                            <div className="text-xs text-gray-500">
                              Generar etiqueta del equipo
                            </div>
                          </div>
                        </button>

                        {/* Opción de eliminar (solo para admin) */}
                        <RoleBased allowedRoles={["admin", "administrativo"]}>
                          <button
                            onClick={() => handleDelete(equipment.id)}
                            className="hover:bg-red-50 w-full text-left px-3 py-2.5 rounded-md text-sm text-red-600 flex items-center gap-3 transition-colors group"
                            disabled={isDeletePending}
                          >
                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                              <X className="h-4 w-4 text-red-600" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">Eliminar equipo</div>
                              <div className="text-xs text-red-500">
                                Esta acción no se puede deshacer
                              </div>
                            </div>
                          </button>
                        </RoleBased>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            {isEditing ? (
              <div className="overflow-y-auto max-h-[calc(90vh-80px)] px-6 pb-10">
                <form
                  onSubmit={handleSubmit(onSubmitEdit)}
                  className="space-y-6"
                >
                  <div className="space-y-3">
                    <Label
                      htmlFor="notes"
                      className="text-sm font-medium text-gray-700"
                    >
                      Notas del Equipo
                    </Label>
                    <Textarea
                      {...register("notes")}
                      id="notes"
                      placeholder="Notas adicionales sobre el equipo..."
                      className="min-h-[120px]"
                    />
                    {errors.notes && (
                      <p className="text-red-500 text-sm">
                        {errors.notes.message}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleEditToggle}
                    >
                      Cancelar
                    </Button>
                    <Button
                      disabled={isUpdatePending}
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isUpdatePending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Actualizando...
                        </>
                      ) : (
                        "Guardar Cambios"
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="overflow-y-auto max-h-[calc(90vh-80px)] px-6 pb-10">
                {/* Equipment Info Card */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Wrench className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {equipment.brand} {equipment.model}
                        </h3>
                        <p className="text-gray-600">
                          {equipment.type.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-sm font-medium ${getStatusColor(equipment.status)}`}
                    >
                      {getStatusText(equipment.status)}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Technical Specifications */}
                  <div className="bg-white border rounded-lg">
                    <div className="px-6 py-4 border-b bg-gray-50">
                      <h4 className="font-medium text-gray-900 flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-gray-600" />
                        Especificaciones Técnicas
                      </h4>
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Número de Serie
                        </label>
                        <p className="text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded mt-1">
                          {equipment.serial_number}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Marca
                          </label>
                          <p className="text-gray-900 mt-1">
                            {equipment.brand.toUpperCase()}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Modelo
                          </label>
                          <p className="text-gray-900 mt-1">
                            {equipment.model.toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500">
                            Tipo
                          </label>
                          <p className="text-gray-900 mt-1">
                            {equipment.type.toUpperCase()}
                          </p>
                        </div>
                        {equipment.capacity && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">
                              Capacidad
                            </label>
                            <p className="text-gray-900 mt-1">
                              {equipment.capacity}{" "}
                              {equipment.capacity_unit || ""}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="bg-white border rounded-lg">
                    <div className="px-6 py-4 border-b bg-gray-50">
                      <h4 className="font-medium text-gray-900 flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-gray-600" />
                        Fechas Importantes
                      </h4>
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Último Mantenimiento
                        </label>
                        <p className="text-gray-900 mt-1">
                          {formatDate(equipment.last_maintenance_date)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Fecha de Creación
                        </label>
                        <p className="text-gray-900 mt-1">
                          {formatDate(equipment.created_at)}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Última Actualización
                        </label>
                        <p className="text-gray-900 mt-1">
                          {formatDate(equipment.updated_at)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Customer Information */}
                  {equipment.current_customer_id && (
                    <div className="bg-white border rounded-lg lg:col-span-2">
                      <div className="px-6 py-4 border-b bg-gray-50">
                        <h4 className="font-medium text-gray-900 flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-600" />
                          Cliente Asignado
                        </h4>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500">
                              Nombre
                            </label>
                            <p className="text-gray-900 mt-1">
                              {equipment.customer_name ||
                                "No se proporcionó nombre"}
                            </p>
                          </div>
                          {equipment.customer_phone && (
                            <div>
                              <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                Teléfono
                              </label>
                              <p className="text-gray-900 mt-1">
                                {formatPhoneNumber(equipment.customer_phone)}
                              </p>
                            </div>
                          )}
                          {equipment.customer_address && (
                            <div>
                              <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                Dirección
                              </label>
                              <p className="text-gray-900 mt-1">
                                {equipment.customer_address}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Location Information */}
                  {equipment.latitude && equipment.longitude && (
                    <div className="bg-white border rounded-lg lg:col-span-2">
                      <div className="px-6 py-4 border-b bg-gray-50">
                        <h4 className="font-medium text-gray-900 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-600" />
                          Ubicación GPS
                        </h4>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500">
                              Coordenadas
                            </label>
                            <p className="text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded mt-1">
                              {equipment.latitude}, {equipment.longitude}
                            </p>
                            {/* boton para ver en maps */}
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${equipment.latitude},${equipment.longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline mt-2 inline-flex items-center gap-1"
                            >
                              Ver en Google Maps
                            </a>
                          </div>
                          {equipment.location_created_at && (
                            <div>
                              <label className="text-sm font-medium text-gray-500">
                                Fecha de Registro
                              </label>
                              <p className="text-gray-900 mt-1">
                                {formatDate(equipment.location_created_at)}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contract Details */}
                {equipment.contract_details && (
                  <div className="bg-white border rounded-lg mt-6">
                    <div className="px-6 py-4 border-b bg-gray-50">
                      <h4 className="font-medium text-gray-900">
                        Detalles del Contrato
                      </h4>
                    </div>
                    <div className="p-6">
                      <div className="bg-gray-50 rounded p-4">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-x-auto">
                          {typeof equipment.contract_details === "string"
                            ? equipment.contract_details
                            : JSON.stringify(
                                equipment.contract_details,
                                null,
                                2,
                              )}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {equipment.notes && (
                  <div className="bg-white border rounded-lg mt-6">
                    <div className="px-6 py-4 border-b bg-gray-50">
                      <h4 className="font-medium text-gray-900">Notas</h4>
                    </div>
                    <div className="p-6">
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                        <p className="text-gray-700">{equipment.notes}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </DialogContent>

      {/* Modales de asignación */}
      <AssignCustomerModal
        open={assignModalOpen}
        onOpenChange={setAssignModalOpen}
        equipmentId={equipment?.id}
        onSuccess={handleModalSuccess}
      />

      <RemoveAssignmentModal
        open={removeModalOpen}
        onOpenChange={setRemoveModalOpen}
        equipment={equipment}
        onSuccess={handleModalSuccess}
      />
    </Dialog>
  );
});

export default EquipmentDetailsModal;
