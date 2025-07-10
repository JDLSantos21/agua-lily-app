import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  CalendarIcon,
  FileText,
  RefreshCcw,
  User,
  Download,
} from "lucide-react";
import { useState, useEffect } from "react";
import { exportToPDF } from "@/lib/exportToPDF";
import { getInventoryReportData } from "@/api/inventory";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useDialogStore } from "@/stores/dialogStore";
import { useUsers } from "@/shared/hooks/useUsers";

interface FormData {
  user_id?: string;
  date: string;
}

export const InventoryReportDialog = () => {
  const [fetching, setFetching] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  const { openDialog, close } = useDialogStore();

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

  const { data: users } = useUsers();

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
      userName =
        users?.find((u) => u.id.toString() == data.user_id)?.name ?? null;
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
      console.log("Error al generar el reporte:", error);
      toast.error("Ocurrió un error al generar el reporte");
    } finally {
      setIsExporting(false);
      setFetching(false);
    }
  }
  return (
    <Dialog open={openDialog === "inventory-report"} onOpenChange={close}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-left">
              <h2 className="text-xl font-semibold text-gray-900">
                Generar Reporte
              </h2>
              <p className="text-sm text-gray-500 font-normal">
                Exporta movimientos de inventario
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        {(fetching || isExporting) && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
            <div className="text-center">
              <NonInteractiveLoader
                text={fetching ? "Obteniendo datos..." : "Generando reporte..."}
              />
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
          {users && users.length > 0 && (
            <RoleBased allowedRoles={["admin", "administrativo"]}>
              <div className="space-y-3">
                <Label
                  htmlFor="user_id"
                  className="text-sm font-medium text-gray-700"
                >
                  Usuario
                </Label>
                <Controller
                  name="user_id"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full h-11 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <SelectValue placeholder="Todos los usuarios" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id.toString()}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <p className="text-xs text-gray-500">
                  Filtra por usuario específico o deja vacío para todos
                </p>
              </div>
            </RoleBased>
          )}

          <div className="space-y-3">
            <Label htmlFor="date" className="text-sm font-medium text-gray-700">
              Fecha del Reporte
            </Label>
            <div className="flex gap-2">
              <Input
                id="date"
                type="date"
                className="flex-1 h-11 border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                value={watchDate}
                onChange={(e) => setValue("date", e.target.value)}
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-11 w-11 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  >
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
            <p className="text-xs text-gray-500">
              Selecciona la fecha para generar el reporte
            </p>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <Button
              type="button"
              onClick={handleReset}
              variant="outline"
              className="h-11 px-4 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
            <Button
              type="submit"
              className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500/20 text-white font-medium"
              disabled={isExporting || fetching}
            >
              <Download className="mr-2 h-4 w-4" />
              Generar Reporte
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
