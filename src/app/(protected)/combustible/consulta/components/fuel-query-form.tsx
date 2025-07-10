// app/combustible/consulta/components/fuel-query-form.tsx
"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { fetchFilteredFuelRecords } from "@/api/fuel";
import FuelQueryTable from "./fuel-query-table";
import { FuelRecords } from "@/types/fuel.types";
import { exportToExcel } from "@/lib/exportToExcel";
import { Search, FileDown, Filter } from "lucide-react";

// Esquema de validación con Zod
const querySchema = z.object({
  current_tag: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

type QueryFormData = z.infer<typeof querySchema>;

export default function FuelQueryForm() {
  const [fuelRecords, setFuelRecords] = useState<FuelRecords | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm<QueryFormData>({
    resolver: zodResolver(querySchema),
    defaultValues: {
      current_tag: "",
      start_date: "",
      end_date: "",
    },
  });

  const onSubmit = async (data: QueryFormData) => {
    setLoading(true);
    try {
      const records = await fetchFilteredFuelRecords({
        current_tag: data.current_tag,
        start_date: data.start_date ? `${data.start_date} 00:00:00` : undefined,
        end_date: data.end_date ? `${data.end_date} 23:59:59` : undefined,
      });
      setFuelRecords(records);
      if (records.length === 0) {
        toast.info("No se encontraron registros con estos filtros.");
      } else {
        toast.success(`Se encontraron ${records.length} registros.`);
      }
    } catch (error) {
      toast.error("Error al consultar los registros de combustible");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    reset();
    setFuelRecords(null);
  };

  return (
    <div className="space-y-6">
      {/* Formulario de filtros */}
      <div className="bg-gray-50 rounded-lg p-6 border">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900">
            Filtros de Búsqueda
          </h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="current_tag"
                className="text-sm font-medium text-gray-700"
              >
                Ficha del Vehículo
              </Label>
              <Input
                id="current_tag"
                placeholder="Ej. F-01"
                className="h-11"
                {...register("current_tag")}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="start_date"
                className="text-sm font-medium text-gray-700"
              >
                Fecha Inicial
              </Label>
              <Input
                id="start_date"
                type="date"
                className="h-11"
                {...register("start_date")}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="end_date"
                className="text-sm font-medium text-gray-700"
              >
                Fecha Final
              </Label>
              <Input
                id="end_date"
                type="date"
                className="h-11"
                {...register("end_date")}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-11"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Buscando...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="px-6 h-11"
            >
              Limpiar
            </Button>
          </div>
        </form>
      </div>

      {/* Acciones */}
      {fuelRecords && fuelRecords.length > 0 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {fuelRecords.length} registro{fuelRecords.length !== 1 ? "s" : ""}{" "}
            encontrado{fuelRecords.length !== 1 ? "s" : ""}
          </div>
          <Button
            onClick={() => exportToExcel(fuelRecords)}
            variant="outline"
            className="h-10"
          >
            <FileDown className="h-4 w-4 mr-2" />
            Exportar a Excel
          </Button>
        </div>
      )}

      {/* Tabla */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <FuelQueryTable fuelRecords={fuelRecords} loading={loading} />
      </div>
    </div>
  );
}
