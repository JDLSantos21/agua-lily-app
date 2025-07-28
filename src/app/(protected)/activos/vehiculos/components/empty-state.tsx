"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, Plus } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  showAddButton?: boolean;
  onAddClick?: () => void;
}

export function EmptyState({
  title,
  description,
  showAddButton = false,
  onAddClick,
}: EmptyStateProps) {
  return (
    <Card className="border-2 border-dashed border-gray-300">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Truck className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-center max-w-md mb-6">{description}</p>
        {showAddButton && onAddClick && (
          <Button onClick={onAddClick} className="gap-2">
            <Plus className="h-4 w-4" />
            Agregar vehículo
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
