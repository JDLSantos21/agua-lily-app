"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Edit, Loader2 } from "lucide-react";
import type { Material } from "@/lib/types";
import moment from "moment";
import { RoleBased } from "@/components/RoleBased";
import { editMaterial } from "@/lib/utils";
import { toast, Toaster } from "sonner";

interface ModalProps {
  material: Material | null;
  closeModal: () => void;
  // Opcional: onMaterialUpdated?: (updated: Material) => void;
}

export default function MaterialsDetailsModal({
  material,
  closeModal,
}: // Opcional: onMaterialUpdated,
ModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  // Usamos un estado para mostrar la información actualizada en el frontend
  const [currentMaterial, setCurrentMaterial] = useState<Material | null>(
    material
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCurrentMaterial((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMaterial || !material) return;
    // Creamos un objeto con solo las propiedades actualizables
    const { name, category, unit, price, minimum_stock, description } =
      currentMaterial;
    const updatedMaterial = {
      name,
      category,
      unit,
      price,
      minimum_stock,
      description,
    };

    setLoading(true);

    editMaterial(material.id, updatedMaterial)
      .then(() => {
        setCurrentMaterial((prev) =>
          prev ? { ...prev, ...updatedMaterial } : null
        );
        toast.success("Material actualizado correctamente");
      })
      .catch((error) => {
        console.error("problema al actualizar el material", error);
        toast.error("Hubo un problema al actualizar el material");
      })
      .finally(() => {
        setLoading(false);
        setIsEditing(false);
      });
  };

  if (!material) return null;

  return (
    <Dialog open={!!material} onOpenChange={closeModal}>
      <Toaster richColors />
      <DialogContent className="max-w-4xl w-full max-h-[90vh] h-auto flex flex-col overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-gray-700">
            {currentMaterial?.name.toLocaleUpperCase()}
          </DialogTitle>
          <DialogDescription>Detalles del material</DialogDescription>
        </DialogHeader>
        <Card className="flex-grow p-6 border-none shadow-none">
          {!isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Información General
                </h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Nombre:</span>{" "}
                    {currentMaterial?.name}
                  </p>
                  <p>
                    <span className="font-medium">Categoría:</span>{" "}
                    {currentMaterial?.category}
                  </p>
                  <p>
                    <span className="font-medium">Unidad:</span>{" "}
                    {currentMaterial?.unit}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Detalles de Inventario
                </h3>
                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Stock:</span> {material.stock}
                  </p>
                  <p>
                    <span className="font-medium">Stock mínimo:</span>{" "}
                    {currentMaterial?.minimum_stock}
                  </p>
                </div>
              </div>
              <div className="col-span-full">
                <h3 className="text-lg font-semibold mb-2">Descripción</h3>
                <p className="text-sm text-gray-600">
                  {currentMaterial?.description}
                </p>
              </div>
              <div className="col-span-full">
                <Separator className="my-4" />
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    <p>
                      Creado: {moment(material.created_at).format("L HH:mm")}
                    </p>
                    <p>
                      Actualizado:{" "}
                      {moment(material.updated_at).format("L HH:mm")}
                    </p>
                  </div>
                  <RoleBased allowedRoles={["admin", "administrativo"]}>
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="ml-2 bg-yellow-500"
                    >
                      <Edit className="mr-2 h-4 w-4" /> Editar
                    </Button>
                  </RoleBased>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    name="name"
                    value={currentMaterial?.name ?? ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Categoría</Label>
                  <Input
                    id="category"
                    name="category"
                    value={currentMaterial?.category ?? ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="unit">Unidad</Label>
                  <Input
                    id="unit"
                    name="unit"
                    value={currentMaterial?.unit ?? ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="minimum_stock">Stock mínimo</Label>
                  <Input
                    id="minimum_stock"
                    name="minimum_stock"
                    className="noControls"
                    type="number"
                    value={currentMaterial?.minimum_stock ?? ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={currentMaterial?.description ?? ""}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>
              <div className="flex justify-end items-center space-x-4 mt-6">
                <span
                  className="text-red-500 text-sm cursor-pointer"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </span>
                <button
                  type="submit"
                  className="text-sm w-20 h-8 bg-blue-500 rounded text-white"
                >
                  {loading ? (
                    <Loader2 className="animate-spin mx-auto" />
                  ) : (
                    <span>Guardar</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </Card>
      </DialogContent>
    </Dialog>
  );
}
