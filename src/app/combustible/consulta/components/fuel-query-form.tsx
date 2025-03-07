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

// Esquema de validación con Zod
const querySchema = z.object({
  current_tag: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

type QueryFormData = z.infer<typeof querySchema>;

export default function FuelQueryForm() {
  const [fuelRecords, setFuelRecords] = useState<FuelRecords>([]);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit } = useForm<QueryFormData>({
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
      }
    } catch (error) {
      toast.error("Error al consultar los registros de combustible");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Formulario de filtros */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col md:flex-row gap-4 items-end"
      >
        <div className="flex-1">
          <Label htmlFor="current_tag">Ficha</Label>
          <Input
            id="current_tag"
            placeholder="Ej. F-01"
            {...register("current_tag")}
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="start_date">Fecha Inicial</Label>
          <Input id="start_date" type="date" {...register("start_date")} />
        </div>
        <div className="flex-1">
          <Label htmlFor="end_date">Fecha Final</Label>
          <Input id="end_date" type="date" {...register("end_date")} />
        </div>
        <Button variant="primary" type="submit">
          Buscar
        </Button>
      </form>

      {/* Botón de exportar */}
      <Button onClick={() => exportToExcel(fuelRecords)} variant="outline">
        Exportar a Excel
      </Button>

      {/* Tabla */}
      <FuelQueryTable fuelRecords={fuelRecords} loading={loading} />
    </div>
  );
}
