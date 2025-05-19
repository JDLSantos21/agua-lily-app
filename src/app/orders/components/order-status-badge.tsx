// src/components/orders/OrderStatusBadge.tsx
import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/types/orders.types";
import { Clock, Loader2, Truck, CheckCircle, XCircle } from "lucide-react";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

const statusConfig = {
  pendiente: {
    variant: "outline",
    label: "Pendiente",
    icon: Clock,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 hover:bg-yellow-50",
    borderColor: "border-yellow-200",
  },
  preparando: {
    variant: "outline",
    label: "Preparando",
    icon: Loader2,
    color: "text-blue-600",
    bgColor: "bg-blue-50 hover:bg-blue-50",
    borderColor: "border-blue-200",
  },
  despachado: {
    variant: "outline",
    label: "Despachado",
    icon: Truck,
    color: "text-purple-600",
    bgColor: "bg-purple-50 hover:bg-purple-50",
    borderColor: "border-purple-200",
  },
  entregado: {
    variant: "outline",
    label: "Entregado",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50 hover:bg-green-50",
    borderColor: "border-green-200",
  },
  cancelado: {
    variant: "outline",
    label: "Cancelado",
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-50 hover:bg-red-50",
    borderColor: "border-red-200",
  },
};

const OrderStatusBadge = memo(function OrderStatusBadge({
  status,
  className = "",
  showIcon = true,
  size = "md",
}: OrderStatusBadgeProps) {
  const config = statusConfig[status];

  if (!config) {
    return (
      <Badge variant="outline" className={className}>
        {status}
      </Badge>
    );
  }

  const Icon = config.icon;

  // Clases de tamaño
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-xs px-2.5 py-0.5",
    lg: "text-sm px-3 py-1",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-3.5 w-3.5",
    lg: "h-4 w-4",
  };

  return (
    <Badge
      variant="outline"
      className={`
        ${config.color} ${config.bgColor} ${config.borderColor} 
        ${sizeClasses[size]} uppercase font-medium
        ${className}
      `}
    >
      {showIcon && (
        <Icon
          className={`${iconSizes[size]} mr-1 ${status === "preparando" ? "animate-spin" : ""}`}
        />
      )}
      {config.label}
    </Badge>
  );
});

export default OrderStatusBadge;
