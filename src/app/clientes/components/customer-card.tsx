// src/app/clientes/components/customer-card.tsx
"use client";

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
} from "lucide-react";
import { Customer } from "@/types/customers.types";
import { motion } from "framer-motion";

interface CustomerCardProps {
  customer: Customer;
  onView: (id: number) => void;
  onEdit: (customer: Customer) => void;
  equipmentCount?: number;
}

export function CustomerCard({
  customer,
  onView,
  onEdit,
  equipmentCount = 0,
}: CustomerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">
                {customer.business_name || customer.name}
              </CardTitle>
              {customer.business_name && (
                <p className="text-sm text-gray-500">{customer.name}</p>
              )}
            </div>
            <Badge
              variant={customer.status === "activo" ? "outline" : "destructive"}
              className="uppercase text-xs"
            >
              {customer.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-2">
          {/* Tipo de cliente */}
          <div className="flex items-center gap-1 text-sm">
            {customer.is_business ? (
              <>
                <Building2 className="h-4 w-4 text-blue-500" />
                <span className="text-blue-500">Empresa</span>
              </>
            ) : (
              <>
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Individual</span>
              </>
            )}
          </div>

          {/* Información de contacto */}
          <div className="space-y-1 mt-3">
            <div className="flex items-center gap-1.5 text-sm">
              <Phone className="h-3.5 w-3.5 text-gray-500" />
              <span>{customer.contact_phone}</span>
            </div>

            {customer.contact_email && (
              <div className="flex items-center gap-1.5 text-sm">
                <Mail className="h-3.5 w-3.5 text-gray-500" />
                <span className="truncate">{customer.contact_email}</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-sm">
              <MapPin className="h-3.5 w-3.5 text-gray-500" />
              <span className="truncate">{customer.address}</span>
            </div>
          </div>

          {/* Equipos */}
          <div className="mt-3 flex items-center gap-1.5 text-sm">
            <Package className="h-4 w-4 text-gray-500" />
            <span>
              {equipmentCount} equipo{equipmentCount !== 1 ? "s" : ""} asignado
              {equipmentCount !== 1 ? "s" : ""}
            </span>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => onView(customer.id as number)}
          >
            <Eye className="h-3.5 w-3.5" />
            Ver
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => onEdit(customer)}
          >
            <Edit className="h-3.5 w-3.5" />
            Editar
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
