import { memo } from "react";
import { Badge } from "@/components/ui/badge";

interface TripBadgeProps {
  type: string;
  count?: number;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
}

/**
 * A specialized badge component for trip types
 */
const TripBadge = memo(function TripBadge({
  type,
  count,
  onClick,
  children,
  className = "",
}: TripBadgeProps) {
  // Determine the badge variant based on the trip type
  const getVariant = () => {
    if (type === "Viaje Estándar") return "standardTrip";
    if (type === "Viaje Rapido") return "quickTrip";
    if (type === "Comisión por ventas") return "comissionTrip";
    return "outline";
  };

  // If count is provided and is zero, use outline variant
  const variant = count !== undefined && count === 0 ? "outline" : getVariant();

  return (
    <Badge
      variant={variant}
      onClick={onClick}
      className={`${onClick ? "cursor-pointer hover:bg-blue-100 transition-colors" : ""} ${className}`}
    >
      {children || count}
    </Badge>
  );
});

export default TripBadge;
