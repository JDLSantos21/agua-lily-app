// src/components/orders/OrderAssignDeliveryDialog.tsx
import { useState, memo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Order } from "@/types/orders.types";
import { Loader2, TruckIcon, UserIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useAssignDelivery } from "@/hooks/useOrders";
import { useVehiclesQuery } from "@/hooks/useVehiclesQuery";
import { useEmployeesQuery } from "@/hooks/useEmployees";

interface OrderAssignDeliveryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
}

const OrderAssignDeliveryDialog = memo(function OrderAssignDeliveryDialog({
  open,
  onOpenChange,
  order,
}: OrderAssignDeliveryDialogProps) {
  const [driverId, setDriverId] = useState<string>("");
  const [vehicleId, setVehicleId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: vehicles } = useVehiclesQuery({ enabled: open });
  const { data: drivers } = useEmployeesQuery("driver", { enabled: open });
  const { mutateAsync: assignDelivery } = useAssignDelivery();

  // Reset state when dialog opens
  useEffect(() => {
    if (open && order) {
      setDriverId(order.delivery_driver_id?.toString() || "");
      setVehicleId(order.vehicle_id?.toString() || "");
    }
  }, [open, order]);

  const handleSubmit = async () => {
    if (!order?.id || !driverId || !vehicleId) {
      return;
    }

    setIsSubmitting(true);

    try {
      await assignDelivery({
        id: order.id,
        data: {
          delivery_driver_id: parseInt(driverId),
          vehicle_id: parseInt(vehicleId),
        },
      });

      onOpenChange(false);
    } catch (error) {
      // Error already handled by the store
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit =
    driverId &&
    vehicleId &&
    (!order?.delivery_driver_id ||
      driverId !== order.delivery_driver_id?.toString() ||
      !order?.vehicle_id ||
      vehicleId !== order.vehicle_id?.toString()) &&
    !isSubmitting;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isSubmitting) {
          onOpenChange(isOpen);
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Asignar Entrega</DialogTitle>
          <DialogDescription>
            Pedido {order?.tracking_code} para{" "}
            {order?.customer_display_name || order?.customer_name}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-5">
          {/* Información actual */}
          {(order?.driver_name || order?.vehicle_tag) && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-500">
                Asignación actual
              </h3>

              {order.driver_name && (
                <div className="flex items-center gap-2 text-sm">
                  <UserIcon className="h-4 w-4 text-gray-400" />
                  <span>Conductor: {order.driver_name}</span>
                </div>
              )}

              {order.vehicle_tag && (
                <div className="flex items-center gap-2 text-sm">
                  <TruckIcon className="h-4 w-4 text-gray-400" />
                  <span>Vehículo: {order.vehicle_tag}</span>
                </div>
              )}

              <Separator />
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="driver">Seleccionar conductor</Label>
              <Select value={driverId} onValueChange={setDriverId}>
                <SelectTrigger id="driver">
                  <SelectValue placeholder="Seleccionar conductor" />
                </SelectTrigger>
                <SelectContent>
                  {drivers?.map((driver: Employee) => (
                    <SelectItem key={driver.id} value={driver.id.toString()}>
                      {driver.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicle">Seleccionar vehículo</Label>
              <Select value={vehicleId} onValueChange={setVehicleId}>
                <SelectTrigger id="vehicle">
                  <SelectValue placeholder="Seleccionar vehículo" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles?.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                      {vehicle.current_tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="gap-1"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Asignando...
              </>
            ) : (
              "Asignar Entrega"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

export default OrderAssignDeliveryDialog;
