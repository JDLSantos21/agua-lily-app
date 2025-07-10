"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Loader2, Trash, Package, Save, X } from "lucide-react";
import type { Material } from "@/lib/types";
import { RoleBased } from "@/components/RoleBased";
// import { deleteMaterial, editMaterial } from "@/api/materials";
import { toast } from "sonner";
import { confirm } from "@tauri-apps/plugin-dialog";
import { format } from "@formkit/tempo";
import { useDeleteMaterial, useEditMaterial } from "@/hooks/useInventory";

interface ModalProps {
  material: Material | null;
  closeModal: () => void;
}

export default function MaterialsDetailsModal({
  material,
  closeModal,
}: ModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState<Material | null>(
    material
  );

  const { mutateAsync: deleteMaterial } = useDeleteMaterial();
  const { mutateAsync: editMaterial, isPending: editLoading } =
    useEditMaterial();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCurrentMaterial((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleMaterialDelete = async (id: number) => {
    const confirmed = await confirm(
      "¿Estas seguro de eliminar este material?",
      "Agua Lily"
    );

    if (!confirmed) {
      toast.info("Operación cancelada por el usuario.");
      return;
    }

    await deleteMaterial(id);
    closeModal();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentMaterial || !material) return;

    const updatedMaterial = {
      name: currentMaterial.name,
      category: currentMaterial.category,
      unit: currentMaterial.unit,
      price: currentMaterial.price,
      minimum_stock: currentMaterial.minimum_stock,
      description: currentMaterial.description,
    };

    await editMaterial({ id: material.id, material: updatedMaterial });

    setIsEditing(false);
  };

  if (!material) return null;

  return (
    <Dialog open={!!material} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-left">
              <h2 className="text-xl font-semibold text-gray-900">
                {currentMaterial?.name}
              </h2>
              <p className="text-sm text-gray-500 font-normal">
                {isEditing ? "Editando material" : "Detalles del material"}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6">
          {!isEditing ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Información General
                    </h3>
                    <div className="mt-3 space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Nombre:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {currentMaterial?.name}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">
                          Categoría:
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {currentMaterial?.category}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Unidad:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {currentMaterial?.unit}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Precio:</span>
                        <span className="text-sm font-medium text-gray-900">
                          ${currentMaterial?.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Inventario
                    </h3>
                    <div className="mt-3 space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">
                          Stock actual:
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {material.stock}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">
                          Stock mínimo:
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {currentMaterial?.minimum_stock}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Descripción
                </h3>
                <p className="mt-2 text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                  {currentMaterial?.description}
                </p>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between items-start">
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>ID del sistema: {material.id}</p>
                    <p>Creado: {format(material.created_at, "DD/MM/YYYY")}</p>
                    <p>
                      Actualizado:{" "}
                      {format(material.updated_at, {
                        date: "long",
                        time: "short",
                      })}
                    </p>
                  </div>
                  <RoleBased allowedRoles={["admin", "administrativo"]}>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                        size="sm"
                        className="border-gray-200 hover:bg-gray-50"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        onClick={() => handleMaterialDelete(material.id)}
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Trash className="h-4 w-4 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  </RoleBased>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-700"
                  >
                    Nombre
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={currentMaterial?.name ?? ""}
                    onChange={handleInputChange}
                    className="mt-1.5 h-11 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="category"
                    className="text-sm font-medium text-gray-700"
                  >
                    Categoría
                  </Label>
                  <Input
                    id="category"
                    name="category"
                    value={currentMaterial?.category ?? ""}
                    onChange={handleInputChange}
                    className="mt-1.5 h-11 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="unit"
                    className="text-sm font-medium text-gray-700"
                  >
                    Unidad
                  </Label>
                  <Input
                    id="unit"
                    name="unit"
                    value={currentMaterial?.unit ?? ""}
                    onChange={handleInputChange}
                    className="mt-1.5 h-11 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="minimum_stock"
                    className="text-sm font-medium text-gray-700"
                  >
                    Stock mínimo
                  </Label>
                  <Input
                    id="minimum_stock"
                    name="minimum_stock"
                    className="mt-1.5 h-11 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 noControls"
                    type="number"
                    value={currentMaterial?.minimum_stock ?? ""}
                    onChange={handleInputChange}
                  />
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
                  name="description"
                  value={currentMaterial?.description ?? ""}
                  onChange={handleInputChange}
                  rows={4}
                  className="mt-1.5 resize-none border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 h-11 border-gray-200 hover:bg-gray-50"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={editLoading}
                  className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  {editLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Guardando...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Guardar
                    </div>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
