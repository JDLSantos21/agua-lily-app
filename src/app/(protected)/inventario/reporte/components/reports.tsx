"use client";

import { useState, useEffect } from "react";
import { exportToPDF } from "@/lib/exportToPDF";
import { getInventoryReportData } from "@/api/inventory";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { CalendarIcon, FileText, Loader2, User } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderSpin } from "@/components/Loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useUsers } from "@/shared/hooks/useUsers";

interface FormData {
  user_id?: string;
  date: string;
}

export default function Reports() {
  const [fetching, setFetching] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  const { control, handleSubmit, setValue, watch } = useForm<FormData>({
    defaultValues: {
      date: format(new Date(), "yyyy-MM-dd"),
    },
  });

  const { data: users } = useUsers();

  const watchDate = watch("date");

  useEffect(() => {
    if (selectedDate) {
      setValue("date", format(selectedDate, "yyyy-MM-dd"));
    }
  }, [selectedDate, setValue]);

  async function onSubmit(data: FormData) {
    let userName;

    if (!data.user_id) {
      delete data.user_id;
    }

    if (data.user_id) {
      userName = users?.find(
        (user) => user.id.toString() == data.user_id
      )?.name;
    }

    setFetching(true);
    try {
      const reportData = await getInventoryReportData(data);

      if (!reportData) {
        toast.error("No se encontraron movimientos para esta fecha");
        return;
      }

      setIsExporting(true);
      await exportToPDF({
        inventoryRecords: reportData,
        selectedUser: userName || null,
        selectedDate: data.date,
      });
    } catch (error) {
      console.error("Error al generar el reporte:", error);
      toast.error("Ocurrió un error al generar el reporte");
    } finally {
      setFetching(false);
      setIsExporting(false);
    }
  }

  if (fetching) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <LoaderSpin text="Obteniendo datos del reporte" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      {isExporting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-[300px]">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-center font-medium">Generando reporte PDF</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Reporte de Inventario
          </CardTitle>
          <CardDescription>
            Genera un reporte de los movimientos de inventario por fecha y
            usuario opcional
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {users && users.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="user_id" className="text-sm font-medium">
                  Usuario
                </Label>
                <Controller
                  name="user_id"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full" id="user_id">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Seleccionar usuario" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los usuarios</SelectItem>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id.toString()}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  Selecciona un usuario específico o deja en blanco para todos
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium">
                Fecha del reporte
              </Label>
              <div className="flex gap-2">
                <Input
                  id="date"
                  type="date"
                  className="w-full"
                  value={watchDate}
                  onChange={(e) => setValue("date", e.target.value)}
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon">
                      <CalendarIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <p className="text-xs text-muted-foreground">
                Selecciona la fecha para la cual deseas generar el reporte
              </p>
            </div>
          </CardContent>

          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={isExporting || fetching}
            >
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generando reporte...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generar reporte
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
