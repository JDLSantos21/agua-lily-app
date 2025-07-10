// src/app/clientes/components/customer-card.tsx - REDISEÑADO
"use client";

import { memo, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Phone,
  Mail,
  MapPin,
  User,
  Building2,
  Edit,
  Eye,
  MoreVertical,
} from "lucide-react";
import { Customer } from "@/types/customers.types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { IoLogoWhatsapp } from "react-icons/io5";

interface CustomerCardProps {
  customer: Customer;
  onView: (id: number) => void;
  onEdit: (customer: Customer) => void;
  onDelete?: (customer: Customer) => void;
  equipmentCount?: number;
  isSelectable?: boolean;
  isSelected?: boolean;
  onSelect?: (customer: Customer) => void;
  layout?: "compact" | "full";
}

export const CustomerCard = memo(function CustomerCard({
  customer,
  onView,
  onEdit,
  onDelete,
  equipmentCount = 0,
  isSelectable = false,
  isSelected = false,
  onSelect,
  layout = "full",
}: CustomerCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Manejadores de eventos
  const handleView = () => onView(customer.id as number);
  const handleEdit = () => onEdit(customer);
  const handleSelect = () => {
    if (isSelectable && onSelect) {
      onSelect(customer);
    }
  };

  // Formatear teléfono
  const formatPhoneNumber = (phone: string) => {
    return phone;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={isSelectable ? handleSelect : undefined}
      className={`group ${isSelectable ? "cursor-pointer" : ""}`}
    >
      <Card
        className={`h-full border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-white overflow-hidden
                       ${isSelected ? "ring-2 ring-blue-500 shadow-lg" : ""} 
                       ${isHovered ? "shadow-lg transform -translate-y-1" : ""}`}
      >
        {/* Header con avatar y tipo */}
        <CardHeader className="pb-4 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              {/* Avatar dinámico */}
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold shadow-sm
                              ${
                                customer.is_business
                                  ? "bg-gradient-to-br from-blue-500 to-blue-600"
                                  : "bg-gradient-to-br from-gray-500 to-gray-600"
                              }`}
              >
                {customer.is_business ? (
                  <Building2 className="w-6 h-6" />
                ) : (
                  <User className="w-6 h-6" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg font-semibold text-gray-900 truncate leading-tight">
                  {customer.business_name || customer.name}
                </CardTitle>
                {customer.business_name && (
                  <p className="text-sm text-gray-500 truncate mt-1">
                    {customer.name}
                  </p>
                )}
              </div>
            </div>

            {/* Dropdown de acciones */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleView}>
                  <Eye className="h-4 w-4 mr-2" />
                  Ver detalles
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Badge de tipo */}
          <div className="flex items-center justify-between mt-3">
            <Badge
              variant="secondary"
              className={`${
                customer.is_business
                  ? "bg-blue-50 text-blue-700 border-blue-200"
                  : "bg-gray-50 text-gray-700 border-gray-200"
              }`}
            >
              {customer.is_business ? "Empresa" : "Individual"}
            </Badge>

            {/* Indicador de WhatsApp */}
            {customer.has_whatsapp && (
              <div className="flex items-center space-x-1">
                <IoLogoWhatsapp className="w-4 h-4 text-green-500" />
                <span className="text-xs text-green-600">WhatsApp</span>
              </div>
            )}
          </div>
        </CardHeader>

        {/* Contenido principal */}
        <CardContent className="py-4 space-y-3">
          {/* Información de contacto */}
          <div className="space-y-2">
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <Phone className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  {formatPhoneNumber(customer.contact_phone)}
                </p>
                <p className="text-xs text-gray-500">Teléfono</p>
              </div>
            </div>

            {customer.contact_email && (
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="font-medium text-gray-900 truncate"
                    title={customer.contact_email}
                  >
                    {customer.contact_email}
                  </p>
                  <p className="text-xs text-gray-500">Email</p>
                </div>
              </div>
            )}

            {customer.address && (
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="font-medium text-gray-900 truncate"
                    title={customer.address}
                  >
                    {customer.address}
                  </p>
                  <p className="text-xs text-gray-500">Dirección</p>
                </div>
              </div>
            )}
          </div>

          {/* Estadísticas rápidas */}
          {layout === "full" && (
            <div className="pt-3 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <p className="text-lg font-semibold text-blue-600">
                    {equipmentCount}
                  </p>
                  <p className="text-xs text-blue-500">Equipos</p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <p className="text-lg font-semibold text-green-600">0</p>
                  <p className="text-xs text-green-500">Órdenes</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        {/* Footer con acciones */}
        <CardFooter className="pt-0 pb-4">
          <div className="flex space-x-2 w-full">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-9 text-sm hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleView();
              }}
            >
              <Eye className="w-4 h-4 mr-1" />
              Ver
            </Button>
            <Button
              variant="default"
              size="sm"
              className="flex-1 h-9 text-sm bg-blue-600 hover:bg-blue-700 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit();
              }}
            >
              <Edit className="w-4 h-4 mr-1" />
              Editar
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
});
