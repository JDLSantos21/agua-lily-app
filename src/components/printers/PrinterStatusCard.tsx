"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Printer, Tag } from "lucide-react";

interface PrinterStatusCardProps {
  title: string;
  selectedPrinter: string | null;
  icon: "thermal" | "label";
  description?: string;
}

export default function PrinterStatusCard({
  title,
  selectedPrinter,
  icon,
  description,
}: PrinterStatusCardProps) {
  const IconComponent = icon === "thermal" ? Printer : Tag;

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <IconComponent className="h-5 w-5 text-blue-600" />
          {title}
        </CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        {selectedPrinter ? (
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-green-50 text-green-700 border-green-200"
            >
              Conectada
            </Badge>
            <span className="font-medium text-sm">{selectedPrinter}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Badge
              variant="destructive"
              className="bg-red-50 text-red-700 border-red-200"
            >
              No configurada
            </Badge>
            <span className="text-sm text-muted-foreground">
              Selecciona una impresora para configurar
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
