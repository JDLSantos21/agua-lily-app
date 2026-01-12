"use client";

import { InactiveCustomer } from "@/types/customers.types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  Phone,
  MapPin,
  Package,
  AlertCircle,
  ShoppingCart,
  User,
} from "lucide-react";
import { formatPhoneNumber } from "@/lib/contactUtils";
import { InactiveEquipmentItem } from "./inactive-equipment-item";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface InactiveCustomerCardProps {
  customer: InactiveCustomer;
  isExpanded: boolean;
  onToggle: () => void;
}

export function InactiveCustomerCard({
  customer,
  isExpanded,
  onToggle,
}: InactiveCustomerCardProps) {
  // Determinar color de alerta según días
  const getAlertColor = (days: number) => {
    if (days >= 30) return "bg-red-100 text-red-700 border border-red-200";
    if (days >= 21) return "bg-red-50 text-red-600 border border-red-200";
    if (days >= 14)
      return "bg-orange-100 text-orange-700 border border-orange-200";
    return "bg-yellow-100 text-yellow-700 border border-yellow-200";
  };

  const displayName = customer.business_name || customer.name;

  return (
    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        {/* Header compacto */}
        <div
          className="flex items-start justify-between cursor-pointer"
          onClick={onToggle}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 truncate">
                {displayName}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                <span>{formatPhoneNumber(customer.contact_phone)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Package className="h-3 w-3" />
                <span>
                  {customer.inactive_equipments.length} equipo
                  {customer.inactive_equipments.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            <Badge
              className={`${getAlertColor(customer.max_days_without_order)} font-semibold`}
            >
              {customer.max_days_without_order}d
            </Badge>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <CardContent className="pt-0 space-y-4">
              {/* Dirección */}
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">{customer.address}</span>
              </div>

              {/* Lista de equipos */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <span>Equipos inactivos</span>
                </div>

                <div className="space-y-2">
                  {customer.inactive_equipments.map((equipment) => (
                    <InactiveEquipmentItem
                      key={equipment.equipment_id}
                      equipment={equipment}
                      customerId={customer.id}
                      customerName={displayName}
                      customerPhone={customer.contact_phone}
                    />
                  ))}
                </div>
              </div>

              {/* Acciones del cliente */}
              <div className="pt-3 border-t">
                <Link
                  href={`/orders?customer_id=${customer.id}`}
                  className="block"
                >
                  <Button variant="outline" size="sm" className="w-full">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Ver Pedidos
                  </Button>
                </Link>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
