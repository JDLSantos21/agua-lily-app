"use client";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { newMaterial } from "@/types/materials/material";
import { useCreateMaterial } from "@/hooks/useInventory";

export default function NewMaterialForm() {
  const { mutateAsync: createMaterial, isPending } = useCreateMaterial();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<newMaterial>();

  const onSubmit: SubmitHandler<newMaterial> = async (data: newMaterial) => {
    const formatMaterial = {
      ...data,
      price: Number(data.price),
      stock: Number(data.stock),
      minimum_stock: Number(data.minimum_stock),
    };

    try {
      await createMaterial(formatMaterial);
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
            Nombre del Material
          </Label>
          <Input
            id="name"
            {...register("name", { required: "El nombre es requerido" })}
            className="mt-1.5 h-11 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="Ej: Cemento Portland"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1.5">{errors.name.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="category"
              className="text-sm font-medium text-gray-700"
            >
              Categoría
            </Label>
            <Input
              id="category"
              {...register("category", {
                required: "La categoría es requerida",
              })}
              className="mt-1.5 h-11 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="Ej: Materiales de construcción"
            />
            {errors.category && (
              <p className="text-red-500 text-xs mt-1.5">
                {errors.category.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="unit" className="text-sm font-medium text-gray-700">
              Unidad
            </Label>
            <Input
              id="unit"
              {...register("unit", {
                required: "La unidad de medida es requerida",
              })}
              className="mt-1.5 h-11 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="Ej: Saco, Kg, Litros"
            />
            {errors.unit && (
              <p className="text-red-500 text-xs mt-1.5">
                {errors.unit.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label
            htmlFor="description"
            className="text-sm font-medium text-gray-700"
          >
            Descripción
          </Label>
          <Textarea
            id="description"
            {...register("description", {
              required: "La descripción es requerida",
            })}
            rows={3}
            className="mt-1.5 resize-none border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="Describe las características del material..."
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1.5">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label
              htmlFor="price"
              className="text-sm font-medium text-gray-700"
            >
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
              className="mt-1.5 h-11 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 noControls"
              placeholder="0.00"
            />
            {errors.price && (
              <p className="text-red-500 text-xs mt-1.5">
                {errors.price.message}
              </p>
            )}
          </div>

          <div>
            <Label
              htmlFor="stock"
              className="text-sm font-medium text-gray-700"
            >
              Cantidad Inicial
            </Label>
            <Input
              id="stock"
              type="number"
              {...register("stock", {
                required: "La cantidad inicial es requerida",
              })}
              className="mt-1.5 h-11 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 noControls"
              placeholder="0"
            />
            {errors.stock && (
              <p className="text-red-500 text-xs mt-1.5">
                {errors.stock.message}
              </p>
            )}
          </div>

          <div>
            <Label
              htmlFor="minimum_stock"
              className="text-sm font-medium text-gray-700"
            >
              Stock Mínimo
            </Label>
            <Input
              id="minimum_stock"
              type="number"
              {...register("minimum_stock", {
                required: "El stock mínimo es requerido",
                min: 0,
              })}
              className="mt-1.5 h-11 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 noControls"
              placeholder="0"
            />
            {errors.minimum_stock && (
              <p className="text-red-500 text-xs mt-1.5">
                {errors.minimum_stock.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-6 border-t border-gray-100">
        <Button
          type="button"
          variant="outline"
          onClick={() => reset()}
          className="flex-1 h-11 border-gray-200 hover:bg-gray-50"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="flex-1 h-11 bg-green-600 hover:bg-green-700 text-white font-medium"
        >
          {isPending ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Registrando...
            </div>
          ) : (
            "Registrar Material"
          )}
        </Button>
      </div>
    </form>
  );
}
