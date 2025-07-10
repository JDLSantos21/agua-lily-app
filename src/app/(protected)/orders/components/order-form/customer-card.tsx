// src/app/orders/components/order-form/customer-card.tsx
import { Customer, CustomerStatus } from "@/types/customers.types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Building, User, CheckCircle } from "lucide-react";
import formatPhoneNumber from "@/shared/utils/formatNumber";

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
        group relative overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md border
        ${
          isSelected
            ? "border-blue-500 bg-blue-50 shadow-sm ring-1 ring-blue-500/20"
            : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
        }
      `}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`
                flex items-center justify-center w-8 h-8 rounded-lg 
                ${customer.is_business ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"}
              `}
              >
                <IsBusinessIcon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">
                  {customer.business_name || customer.name}
                </h3>
                {customer.status === CustomerStatus.INACTIVE && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 mt-1">
                    Inactivo
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="truncate">
                  {formatPhoneNumber(customer.contact_phone)}
                </span>
              </div>

              <div className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="line-clamp-2 flex-1">{customer.address}</span>
              </div>

              {customer.rnc && (
                <div className="text-sm">
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                    RNC: {customer.rnc}
                  </span>
                </div>
              )}
            </div>
          </div>

          {isSelected && (
            <div className="absolute top-2 right-2">
              <div className="flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            variant={isSelected ? "default" : "outline"}
            size="sm"
            className={`
              text-xs h-8 px-4 transition-all duration-200
              ${
                isSelected
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "group-hover:border-blue-500 group-hover:text-blue-600"
              }
            `}
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
