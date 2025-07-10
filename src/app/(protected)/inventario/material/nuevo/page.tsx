"use client";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { Package, FileText, Tag, AlertCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { newMaterial } from "@/types/materials/material";
import { setMaterial } from "@/api/materials";
import { useState } from "react";

export default function MaterialForm() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<newMaterial>();

  const onSubmit: SubmitHandler<newMaterial> = (data: newMaterial) => {
    setLoading(true);

    const formatMaterial = {
      ...data,
      price: Number(data.price),
      stock: Number(data.stock),
      minimum_stock: Number(data.minimum_stock),
    };

    try {
      toast.success("El material se ha registrado correctamente.");
      setMaterial(formatMaterial);
      reset();
    } catch (error) {
      toast.error("Ocurrion un error al registrar el material");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mt-5">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name" className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4" />
            Nombre del Material
          </Label>
          <Input
            id="name"
            {...register("name", { required: "El nombre es requerido" })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="category" className="flex items-center gap-2 mb-2">
            <Tag className="w-4 h-4" />
            Categoría
          </Label>
          <Input
            id="category"
            {...register("category", { required: "La categoría es requerida" })}
          />
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">
              {errors.category.message}
            </p>
          )}
        </div>

        <div className="col-span-2">
          <Label htmlFor="description" className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4" />
            Descripción
          </Label>
          <Textarea
            id="description"
            {...register("description", {
              required: "La descripción es requerida",
            })}
            rows={3}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="price" className="flex items-center gap-2 mb-2">
              Precio
            </Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              {...register("price", {
                required: "El precio es requerido",
                min: 0,
              })}
              className="w-full noControls"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">
                {errors.price.message}
              </p>
            )}
          </div>
          <div className="flex-1">
            <Label htmlFor="unit" className="flex items-center gap-2 mb-2">
              Unidad
            </Label>
            <Input
              id="unit"
              {...register("unit", {
                required: "La unidad de medida es requerida",
              })}
              className="w-full"
            />
            {errors.unit && (
              <p className="text-red-500 text-sm mt-1">{errors.unit.message}</p>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="stock" className="flex items-center gap-2 mb-2">
              Disponibilidad actual
            </Label>
            <Input
              id="stock"
              type="number"
              {...register("stock", {
                required: "La disponibilidad actual es requerida",
              })}
              className="w-full noControls"
            />
            {errors.stock && (
              <p className="text-red-500 text-sm mt-1">
                {errors.stock.message}
              </p>
            )}
          </div>
          <div className="flex-1">
            <Label
              htmlFor="minimum_stock"
              className="flex items-center gap-2 mb-2"
            >
              <AlertCircle className="w-4 h-4" />
              Disponibilidad Minima
            </Label>
            <Input
              id="minimum_stock"
              type="number"
              {...register("minimum_stock", {
                required: "La disponibilidad mínima es requerida",
                min: 0,
              })}
              className="w-full noControls"
            />
            {errors.minimum_stock && (
              <p className="text-red-500 text-sm mt-1">
                {errors.minimum_stock.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <Button
        variant={`primary`}
        disabled={loading}
        type="submit"
        className="w-full mt-6"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          "Registrar Material"
        )}
      </Button>
    </form>
  );
}
