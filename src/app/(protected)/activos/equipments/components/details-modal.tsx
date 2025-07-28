import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import formatPhoneNumber from "@/shared/utils/formatNumber";
import { Equipment } from "@/types/equipments.types";
import {
  CalendarDays,
  MapPin,
  Wrench,
  User,
  Phone,
  Edit,
  X,
  EllipsisVertical,
} from "lucide-react";

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment: Equipment | null;
  onEdit?: (equipment: Equipment) => void;
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return "No registrado";
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "active":
    case "activo":
      return "bg-green-100 text-green-800";
    case "inactive":
    case "inactivo":
      return "bg-gray-100 text-gray-800";
    case "maintenance":
    case "mantenimiento":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusText = (status: string) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "Activo";
    case "inactive":
      return "Inactivo";
    case "maintenance":
      return "Mantenimiento";
    default:
      return status || "Sin estado";
  }
};

export default function EquipmentDetailsModal({
  isOpen,
  onClose,
  equipment,
  onEdit,
}: DetailsModalProps) {
  if (!equipment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        aria-describedby={undefined}
        className="max-w-4xl max-h-[90vh] overflow-hidden p-0 [&>button]:hidden"
      >
        {/* Header */}
        <div className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Detalles del Equipo #{equipment.id}
              </DialogTitle>
              <p className="text-gray-600 text-sm mt-1">
                {equipment.brand} {equipment.model}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {onEdit && (
                <button
                  onClick={() => onEdit(equipment)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
              )}
              <Popover>
                <PopoverTrigger>
                  <EllipsisVertical className="h-5 hover:text-gray-500" />
                </PopoverTrigger>
                <PopoverContent>
                  <ul className="">
                    <li>
                      <button className="w-full text-left px-2 py-1 hover:bg-gray-100 active:opacity-75">
                        Editar
                      </button>
                      <button className="w-full text-left px-2 py-1 hover:bg-gray-100 active:opacity-75">
                        Imprimir Etiqueta
                      </button>
                      <button className="w-full text-left px-2 py-1 text-red-500 hover:bg-gray-100 active:opacity-75">
                        Eliminar
                      </button>
                    </li>
                  </ul>
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

        {/* Content */}
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
                  <p className="text-gray-600">{equipment.type}</p>
                </div>
              </div>
              <Badge
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
                        {equipment.capacity} {equipment.capacity_unit || ""}
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
            {equipment.customer_name && (
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
                        {equipment.customer_name}
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
                      : JSON.stringify(equipment.contract_details, null, 2)}
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
      </DialogContent>
    </Dialog>
  );
}
