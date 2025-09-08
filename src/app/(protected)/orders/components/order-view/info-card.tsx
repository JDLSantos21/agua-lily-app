import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface InfoCardProps {
  icon: LucideIcon;
  label: string;
  value: string | React.ReactNode;
  className?: string;
  iconClassName?: string;
  labelClassName?: string;
  valueClassName?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  icon: Icon,
  label,
  value,
  className,
  iconClassName,
  labelClassName,
  valueClassName,
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-2 bg-gray-50 rounded-lg",
        className
      )}
    >
      <Icon className={cn("h-4 w-4 text-gray-500", iconClassName)} />
      <div>
        <p className={cn("text-xs text-gray-500 font-medium", labelClassName)}>
          {label}
        </p>
        <p className={cn("text-sm font-medium", valueClassName)}>{value}</p>
      </div>
    </div>
  );
};

export default InfoCard;
