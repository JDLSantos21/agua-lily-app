// src/app/orders/components/order-form/customer-card.tsx
import { Customer, CustomerStatus } from "@/types/customers.types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Building, User, CheckCircle } from "lucide-react";

interface CustomerCardProps {
  customer: Customer;
  isSelected: boolean;
  onSelect: () => void;
}

export function CustomerCard({
  customer,
  isSelected,
  onSelect,
}: CustomerCardProps) {
  const IsBusinessIcon = customer.is_business ? Building : User;

  return (
    <Card
      className={`
        overflow-hidden cursor-pointer transition-all hover:border-primary hover:shadow-sm
        ${isSelected ? "border-primary bg-primary/5" : ""}
      `}
      onClick={onSelect}
    >
      <CardContent className="p-3">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <IsBusinessIcon
                className={`h-4 w-4 ${customer.is_business ? "text-blue-500" : "text-gray-500"}`}
              />
              <h3 className="font-medium text-sm truncate">{customer.name}</h3>
            </div>

            {customer.status === CustomerStatus.INACTIVE && (
              <div className="text-xs text-red-500 mt-0.5">
                Cliente inactivo
              </div>
            )}

            <div className="mt-2 space-y-1">
              <div className="flex items-center text-xs text-gray-600 gap-1">
                <Phone className="h-3 w-3 text-gray-400 flex-shrink-0" />
                <span className="truncate">{customer.contact_phone}</span>
              </div>

              <div className="flex items-start text-xs text-gray-600 gap-1">
                <MapPin className="h-3 w-3 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="line-clamp-2">{customer.address}</span>
              </div>

              {customer.rnc && (
                <div className="text-xs text-gray-600">
                  <span className="bg-gray-100 px-1.5 py-0.5 rounded">
                    RNC: {customer.rnc}
                  </span>
                </div>
              )}
            </div>
          </div>

          {isSelected && (
            <CheckCircle className="h-5 w-5 text-primary ml-2 flex-shrink-0" />
          )}
        </div>

        <div className="mt-2 flex justify-end">
          <Button
            variant={isSelected ? "default" : "outline"}
            size="sm"
            className="text-xs h-7"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            {isSelected ? "Seleccionado" : "Seleccionar"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
