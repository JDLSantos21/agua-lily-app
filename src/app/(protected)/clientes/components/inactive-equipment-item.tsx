"use client";

import { InactiveEquipment } from "@/types/customers.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Refrigerator,
  Package,
  Calendar,
  Clock,
  ExternalLink,
} from "lucide-react";
import { IoLogoWhatsapp } from "react-icons/io5";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  openWhatsApp,
  generateInactiveCustomerMessage,
} from "@/lib/contactUtils";
import Link from "next/link";

interface InactiveEquipmentItemProps {
  equipment: InactiveEquipment;
  customerId: number;
  customerName: string;
  customerPhone: string;
}

export function InactiveEquipmentItem({
  equipment,
  customerId,
  customerName,
  customerPhone,
}: InactiveEquipmentItemProps) {
  // Icono según tipo de equipo
  const EquipmentIcon =
    equipment.equipment_type.toLowerCase() === "nevera"
      ? Refrigerator
      : Package;

  // Color de producto
  const getProductColor = (productType: string) => {
    if (productType.toLowerCase().includes("hielo"))
      return "bg-cyan-100 text-cyan-700 border-cyan-200";
    if (productType.toLowerCase().includes("botellon"))
      return "bg-blue-100 text-blue-700 border-blue-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  // Manejar contacto
  const handleContact = () => {
    const message = generateInactiveCustomerMessage(
      customerName,
      equipment.expected_product_type,
      equipment.days_without_order
    );
    openWhatsApp(customerPhone, message);
  };

  // Formatear fecha
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "N/A";
    try {
      return format(new Date(dateStr), "dd/MM/yyyy", { locale: es });
    } catch {
      return dateStr;
    }
  };

  const isNewEquipment =
    !equipment.last_order_date ||
    equipment.last_order_date === equipment.assigned_date;

  return (
    <div className="bg-gray-50 rounded-lg p-3 space-y-3 border border-gray-200">
      {/* Header del equipo */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200 flex-shrink-0">
            <EquipmentIcon className="h-5 w-5 text-gray-600" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 text-sm">
              {equipment.equipment_model}
            </p>
            <p className="text-xs text-gray-500">
              Serial: {equipment.equipment_serial}
            </p>
            <Badge
              className={`mt-1 text-xs ${getProductColor(equipment.expected_product_type)}`}
              variant="outline"
            >
              {equipment.expected_product_type}
            </Badge>
          </div>
        </div>

        <Badge
          variant="destructive"
          className="text-xs font-semibold flex-shrink-0"
        >
          {equipment.days_without_order}d
        </Badge>
      </div>

      {/* Detalles */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-gray-600">
          <Calendar className="h-3 w-3" />
          <span>Asignado: {formatDate(equipment.assigned_date)}</span>
        </div>

        <div className="flex items-center gap-1.5 text-gray-600">
          <Clock className="h-3 w-3" />
          <span>
            {isNewEquipment
              ? "Sin pedidos"
              : `Último: ${formatDate(equipment.last_order_date)}`}
          </span>
        </div>

        {equipment.weekly_commitment && (
          <div className="col-span-2 text-gray-600">
            <span className="font-medium">Compromiso:</span>{" "}
            {equipment.weekly_commitment} unidades/semana
          </div>
        )}
      </div>

      {/* Acciones */}
      <div className="flex gap-2 pt-2 border-t border-gray-200">
        <Button
          variant="outline"
          size="sm"
          onClick={handleContact}
          className="flex-1 text-xs"
        >
          <IoLogoWhatsapp className="h-4 w-4 mr-1" />
          Contactar
        </Button>
        <Link
          href={`/activos/equipments?equipment_id=${equipment.equipment_id}`}
          className="flex-1"
        >
          <Button variant="ghost" size="sm" className="w-full text-xs">
            <ExternalLink className="h-3 w-3 mr-1" />
            Ver Equipo
          </Button>
        </Link>
      </div>
    </div>
  );
}
