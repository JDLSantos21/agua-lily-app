import { OrderStatus } from "@/types/orders.types";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Package,
  Truck,
} from "lucide-react";

type statusOption = {
  value: OrderStatus;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
};

export const STATUS_OPTION: statusOption[] = [
  {
    value: "pendiente",
    label: "Pendiente",
    description: "Pedido recibido, esperando procesamiento.",
    icon: Clock,
    color: "amber",
  },
  {
    value: "preparando",
    label: "Preparando",
    description: "Preparando los productos para despacharlos.",
    icon: Package,
    color: "blue",
  },
  {
    value: "despachado",
    label: "Despachado",
    description: "El pedido está en camino hacia el cliente.",
    icon: Truck,
    color: "purple",
  },
  {
    value: "entregado",
    label: "Entregado",
    description: "El pedido fue completado exitosamente.",
    icon: CheckCircle,
    color: "green",
  },
  {
    value: "cancelado",
    label: "Cancelado",
    description: "El pedido fue cancelado.",
    icon: AlertTriangle,
    color: "red",
  },
];
