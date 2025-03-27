"use client";

import { useState, useEffect } from "react";
import { exportToPDF } from "@/lib/exportToPDF";
import { getInventoryReportData } from "@/api/inventory";
import { getUsers } from "@/api/users";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { CalendarIcon, FileText, RefreshCcw, User } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { NonInteractiveLoader } from "@/components/non-interactive-loader";
import { RoleBased } from "@/components/RoleBased";

interface FormData {
  user_id?: string;
  date: string;
}

export default function Reports() {
  const [fetching, setFetching] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  const { control, handleSubmit, setValue, watch } = useForm<FormData>({
    defaultValues: {
      date: format(new Date(), "yyyy-MM-dd"),
    },
  });

  const watchDate = watch("date");

  const handleReset = () => {
    setValue("user_id", "");
    setValue("date", format(new Date(), "yyyy-MM-dd"));
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.log(error);
        toast.error("Ocurrió un error al obtener los usuarios");
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      setValue("date", format(selectedDate, "yyyy-MM-dd"));
    }
  }, [selectedDate, setValue]);

  async function onSubmit(data: FormData) {
    console.log("Datos del reporte: ", data);
    if (!data.user_id) {
      delete data.user_id;
    }

    let userName: string | null = null;

    if (data.user_id) {
      userName = users.find((u) => u.id == data.user_id)?.name ?? null;
    }

    try {
      setFetching(true);
      const reportData = await getInventoryReportData(data);
      setFetching(false);

      if (reportData.length === 0) {
        toast.info("No se encontraron movimientos para esta fecha.");
        return;
      }

      setIsExporting(true);
      await exportToPDF({
        inventoryRecords: reportData,
        selectedDate: data.date,
        selectedUser: userName,
      });
    } catch (error) {
      console.error("Error al generar el reporte:", error);
      toast.error("Ocurrió un error al generar el reporte");
    } finally {
      setIsExporting(false);
      setFetching(false);
    }
  }

  return (
    <div className="py-6">
      {fetching && <NonInteractiveLoader text="Obteniendo datos" />}
      {isExporting && <NonInteractiveLoader text="Preparando reporte" />}

      <div className="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-2">
            <FileText className="h-5 w-5" />
            Reporte de Inventario
          </h1>
          <p className="text-muted-foreground">
            Genera un reporte de los movimientos de inventario por fecha y
            usuario opcional
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-6">
            {users && users.length > 0 && (
              <RoleBased allowedRoles={["admin", "administrativo"]}>
                <div className="space-y-2">
                  <Label htmlFor="user_id" className="text-sm font-medium">
                    Usuario
                  </Label>
                  <Controller
                    name="user_id"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full max-w-md" id="user_id">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <SelectValue placeholder="Seleccionar usuario" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem
                              key={user.id}
                              value={user.id.toString()}
                            >
                              {user.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <p className="text-xs text-muted-foreground">
                    Selecciona un usuario específico o selecciona Todos los
                    usuarios para ver todos los movimientos
                  </p>
                </div>
              </RoleBased>
            )}

            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium">
                Fecha del reporte
              </Label>
              <div className="flex gap-2 max-w-md">
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
          </div>

          <div>
            <Button
              type="submit"
              className="w-full max-w-[400px] mr-2"
              disabled={isExporting || fetching}
            >
              <FileText className="mr-2 h-4 w-4" />
              Generar reporte
            </Button>
            <Button
              onClick={() => handleReset()}
              className="w-[48px]"
              type="button"
              variant="outline"
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
