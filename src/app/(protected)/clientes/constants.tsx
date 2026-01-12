import { Badge } from "@/components/ui/badge";
import { TableColumn } from "@/components/ui/custom-table";
import { Customer } from "@/types/customers.types";
import { Building2, User, Phone, MapPin } from "lucide-react";
import { IoLogoWhatsapp } from "react-icons/io5";
import formatPhoneNumber from "@/shared/utils/formatNumber";

export const CUSTOMER_COLUMNS: TableColumn<Customer>[] = [
  {
    key: "name",
    label: "Cliente",
    width: "35%",
    render: (customer) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
          {customer.is_business ? (
            <Building2 className="w-5 h-5" />
          ) : (
            <User className="w-5 h-5" />
          )}
        </div>
        <div>
          <div className="font-semibold text-gray-900">
            {customer.business_name || customer.name}
          </div>
          {customer.business_name && (
            <div className="text-sm text-gray-500">{customer.name}</div>
          )}
        </div>
      </div>
    ),
  },
  {
    key: "contact",
    label: "Contacto",
    width: "25%",
    render: (customer) => (
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-900">
            {formatPhoneNumber(customer.contact_phone)}
          </span>
          {customer.has_whatsapp && (
            <IoLogoWhatsapp className="w-4 h-4 text-green-500" />
          )}
        </div>
        {customer.contact_email && (
          <div className="text-sm text-gray-500 truncate max-w-[200px]">
            {customer.contact_email}
          </div>
        )}
      </div>
    ),
  },
  {
    key: "address",
    label: "Dirección",
    width: "25%",
    render: (customer) => (
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <span className="text-sm text-gray-600 truncate">
          {customer.address}
        </span>
      </div>
    ),
  },
  {
    key: "type",
    label: "Tipo",
    width: "15%",
    render: (customer) => (
      <Badge
        variant={customer.is_business ? "default" : "secondary"}
        className={
          customer.is_business
            ? "bg-blue-50 text-blue-700 border-blue-200"
            : "bg-gray-50 text-gray-700 border-gray-200"
        }
      >
        {customer.is_business ? (
          <>
            <Building2 className="w-3 h-3 mr-1" />
            Empresa
          </>
        ) : (
          <>
            <User className="w-3 h-3 mr-1" />
            Individual
          </>
        )}
      </Badge>
    ),
  },
];
