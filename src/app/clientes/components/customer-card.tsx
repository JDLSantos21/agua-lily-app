// src/app/clientes/components/customer-card.tsx - VERSIÓN MEJORADA
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
  Package,
  User,
  Building2,
  Edit,
  Eye,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { Customer, CustomerStatus } from "@/types/customers.types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

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

  // Determinamos clases CSS basadas en el estado de selección
  const cardClasses = `${isSelected ? "ring-2 ring-primary" : ""} 
                     ${isHovered ? "shadow-md" : "shadow-sm"} 
                     transition-all duration-200 h-full`;

  // Manejadores de eventos
  const handleView = () => onView(customer.id as number);
  const handleEdit = () => onEdit(customer);
  const handleSelect = () => {
    if (isSelectable && onSelect) {
      onSelect(customer);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={{ y: -2 }}
      onClick={isSelectable ? handleSelect : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={isSelectable ? "cursor-pointer" : ""}
    >
      <Card className={cardClasses}>
        <CardHeader className="pb-2 flex flex-row justify-between items-start space-y-0">
          <div>
            <CardTitle className="text-lg font-semibold line-clamp-1">
              {customer.business_name || customer.name}
            </CardTitle>
            {customer.business_name && (
              <p className="text-sm text-gray-500 line-clamp-1">
                {customer.name}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-1">
            <Badge
              variant={
                customer.status === CustomerStatus.ACTIVE
                  ? "outline"
                  : "destructive"
              }
              className="uppercase text-xs whitespace-nowrap"
            >
              {customer.status}
            </Badge>

            {layout === "full" && onDelete && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleView}>
                    <Eye className="h-4 w-4 mr-2" /> Ver detalles
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleEdit}>
                    <Edit className="h-4 w-4 mr-2" /> Editar
                  </DropdownMenuItem>
                  {onDelete && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation(); // Evitar propagación
                        onDelete(customer);
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Eliminar
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>

        <CardContent
          className={layout === "compact" ? "py-2" : "py-3 space-y-3"}
        >
          {/* Tipo de cliente */}
          <div className="flex items-center gap-1.5 text-sm">
            {customer.is_business ? (
              <>
                <Building2 className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span className="text-blue-600 font-medium">Empresa</span>
              </>
            ) : (
              <>
                <User className="h-4 w-4 text-gray-600 flex-shrink-0" />
                <span className="text-gray-700">Individual</span>
              </>
            )}
          </div>

          {/* Información de contacto */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-sm">
              <Phone className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
              <span className="text-gray-700">{customer.contact_phone}</span>
            </div>

            {customer.contact_email && (
              <div className="flex items-center gap-1.5 text-sm">
                <Mail className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
                <span
                  className="text-gray-700 truncate max-w-full"
                  title={customer.contact_email}
                >
                  {customer.contact_email}
                </span>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-sm">
              <MapPin className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
              <span
                className="text-gray-700 truncate max-w-full"
                title={customer.address}
              >
                {customer.address}
              </span>
            </div>
          </div>

          {/* Equipos - solo si layout es full */}
          {layout === "full" && (
            <div className="flex items-center gap-1.5 text-sm pt-1">
              <Package className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <span className="text-gray-700">
                {equipmentCount} equipo{equipmentCount !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </CardContent>

        {layout === "full" && (
          <CardFooter className="pt-0 flex justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-1"
              onClick={(e) => {
                e.stopPropagation(); // Evitar propagación en caso de selección
                handleView();
              }}
            >
              <Eye className="h-3.5 w-3.5" />
              Ver
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-1"
              onClick={(e) => {
                e.stopPropagation(); // Evitar propagación en caso de selección
                handleEdit();
              }}
            >
              <Edit className="h-3.5 w-3.5" />
              Editar
            </Button>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
});
