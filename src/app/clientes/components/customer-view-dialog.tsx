// src/app/clientes/components/customer-view-dialog.tsx
"use client";

import { useCustomerWithEquipment } from "@/hooks/useCustomers";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Building,
  UserRound,
  Phone,
  Mail,
  MapPin,
  FileText,
  MonitorSmartphone,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { LoaderSpin } from "@/components/Loader";
import { EquipmentList } from "../../equipos/components/equipment-list";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CustomerViewDialogProps {
  customerId: number;
  open: boolean;
  onClose: () => void;
}

export function CustomerViewDialog({
  customerId,
  open,
  onClose,
}: CustomerViewDialogProps) {
  const { data, isLoading, error } = useCustomerWithEquipment(customerId);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Detalles del Cliente</DialogTitle>
          <DialogDescription>
            Información completa del cliente y sus equipos asociados
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-12 flex justify-center">
            <LoaderSpin text="Cargando información del cliente" />
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">
            <p>Error al cargar los datos del cliente</p>
            <Button variant="outline" onClick={onClose} className="mt-4">
              Cerrar
            </Button>
          </div>
        ) : data?.data ? (
          <ScrollArea className="flex-1">
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="info">Información</TabsTrigger>
                <TabsTrigger value="equipment">Equipos</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Información principal */}
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <h3 className="text-xl font-semibold">
                        {data.data.is_business
                          ? data.data.business_name
                          : data.data.name}
                      </h3>
                      <Badge
                        variant="outline"
                        className="ml-2 flex items-center gap-1"
                      >
                        {data.data.is_business ? (
                          <>
                            <Building className="h-3 w-3" />
                            Empresa
                          </>
                        ) : (
                          <>
                            <UserRound className="h-3 w-3" />
                            Personal
                          </>
                        )}
                      </Badge>
                      <Badge
                        variant={
                          data.data.status === "activo"
                            ? "standardTrip"
                            : "destructive"
                        }
                        className="ml-2 capitalize"
                      >
                        {data.data.status}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{data.data.contact_phone}</span>
                      </div>

                      {data.data.contact_email && (
                        <div className="flex items-center text-gray-600">
                          <Mail className="h-4 w-4 mr-2" />
                          <span>{data.data.contact_email}</span>
                        </div>
                      )}

                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{data.data.address}</span>
                      </div>

                      {data.data.is_business && data.data.rnc && (
                        <div className="flex items-center text-gray-600">
                          <FileText className="h-4 w-4 mr-2" />
                          <span>RNC: {data.data.rnc}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Detalles adicionales */}
                  <div className="space-y-4">
                    <h4 className="font-semibold">Información adicional</h4>

                    {data.data.location_reference && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">
                          Referencia de ubicación
                        </p>
                        <p>{data.data.location_reference}</p>
                      </div>
                    )}

                    {data.data.notes && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-500">
                          Notas
                        </p>
                        <p>{data.data.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="equipment" className="py-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                      <MonitorSmartphone className="h-5 w-5" />
                      Equipos Asignados (
                      {data.data.current_equipment?.length || 0})
                    </h3>
                  </div>

                  <Separator />

                  {data.data.current_equipment?.length > 0 ? (
                    <div className="rounded-md border">
                      <EquipmentList
                        equipments={data.data.current_equipment}
                        minimal={true}
                      />
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>
                        Este cliente no tiene equipos asignados actualmente.
                      </p>
                    </div>
                  )}

                  {data.data.equipment_history?.length > 0 && (
                    <div className="mt-8 space-y-3">
                      <h4 className="font-semibold">Historial de equipos</h4>

                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Equipo</TableHead>
                              <TableHead>Fecha de asignación</TableHead>
                              <TableHead>Fecha de remoción</TableHead>
                              <TableHead>Razón de remoción</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {data.data.equipment_history.map((history: any) => (
                              <TableRow key={history.id}>
                                <TableCell>{`${history.type} ${history.brand} ${history.model}`}</TableCell>
                                <TableCell>
                                  {new Date(
                                    history.assigned_date
                                  ).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                  {history.removed_date
                                    ? new Date(
                                        history.removed_date
                                      ).toLocaleDateString()
                                    : "Activo"}
                                </TableCell>
                                <TableCell>
                                  {history.removal_reason || "-"}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </ScrollArea>
        ) : (
          <div className="py-8 text-center text-gray-500">
            <p>No se encontró información del cliente</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
