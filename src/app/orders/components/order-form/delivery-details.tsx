// src/app/orders/components/order-form/delivery-details.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/app/settings/labels/components/date-picker";
import { Clock, CalendarCheck, FileText, Truck } from "lucide-react";
import { formatDateToUTC } from "@/shared/utils/formatDateToUTC";

interface DeliveryDetailsProps {
  initialData: {
    scheduled_delivery_date?: string | Date;
    delivery_time_slot?: string | null;
    notes?: string | null;
    delivery_notes?: string | null;
  };
  onChange: (data: {
    scheduled_delivery_date?: string | Date;
    delivery_time_slot?: string | null;
    notes?: string | null;
    delivery_notes?: string | null;
  }) => void;
}

// Opciones de franjas horarias
const TIME_SLOTS = [
  { value: "7:00 AM - 11:59 AM", label: "Mañana (7:00 AM - 11:59 AM)" },
  { value: "12:00 PM - 6:00 PM", label: "Tarde (12:00 PM - 6:00 PM)" },
];

export default function DeliveryDetails({
  initialData,
  onChange,
}: DeliveryDetailsProps) {
  // Estado para fecha de entrega
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(
    initialData.scheduled_delivery_date
      ? new Date(formatDateToUTC(initialData.scheduled_delivery_date) || "")
      : undefined
  );

  // Estado para franja horaria
  const [timeSlot, setTimeSlot] = useState<string | undefined>(
    initialData.delivery_time_slot || undefined
  );

  // Estado para notas
  const [notes, setNotes] = useState<string>(initialData.notes || "");
  const [deliveryNotes, setDeliveryNotes] = useState<string>(
    initialData.delivery_notes || ""
  );

  // Actualizar datos cuando cambien los campos
  useEffect(() => {
    const newData = {
      scheduled_delivery_date: deliveryDate || undefined,
      delivery_time_slot: timeSlot || null,
      notes: notes.trim() || null,
      delivery_notes: deliveryNotes.trim() || null,
    };

    onChange(newData);
  }, [deliveryDate, timeSlot, notes, deliveryNotes]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Detalles de la entrega */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-md flex items-center gap-1">
              <Truck className="h-4 w-4" />
              Detalles de Entrega
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <CalendarCheck className="h-4 w-4" />
                Fecha de Entrega
              </Label>
              <DatePicker
                date={deliveryDate}
                setDate={setDeliveryDate}
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Si no selecciona una fecha, se programará según disponibilidad.
              </p>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Franja Horaria
              </Label>
              <Select value={timeSlot} onValueChange={setTimeSlot}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar franja horaria" />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SLOTS.map((slot) => (
                    <SelectItem key={slot.value} value={slot.value}>
                      {slot.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                La franja horaria está sujeta a disponibilidad.
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="delivery-notes"
                className="flex items-center gap-1"
              >
                <Truck className="h-4 w-4" />
                Instrucciones de Entrega
              </Label>
              <Textarea
                id="delivery-notes"
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                placeholder="Instrucciones específicas para el conductor (punto de referencia, información de acceso, etc.)"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notas adicionales */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-md flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Notas Adicionales
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Notas Generales del Pedido</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notas adicionales para este pedido"
                rows={8}
              />
            </div>

            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-700">
                <strong>Consejo:</strong> Incluya cualquier información
                adicional relevante para el procesamiento de su pedido, pero no
                información de entrega (use el campo de instrucciones de entrega
                para eso).
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
