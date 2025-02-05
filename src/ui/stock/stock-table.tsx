"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState, useCallback } from "react";
import { Material } from "@/lib/types";
import { fetchFilteredStock } from "@/lib/data";
import { MaterialsTableSkeleton } from "../skeletons";
import { OutputModal } from "./outputModal";
import { Toaster } from "sonner";

export default function StockTable({ query }: { query: string }) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  );

  const updateStock = ({ quantity, id }: { quantity: number; id: number }) => {
    setMaterials((prev) =>
      prev.map((material) =>
        material.id === id
          ? { ...material, stock: material.stock - quantity }
          : material
      )
    );
  };

  const openModal = (material: Material) => {
    setSelectedMaterial(material);
  };

  const fetchMaterials = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchFilteredStock(query);
      setMaterials(data);
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
    setLoading(false);
  }, [query]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  const closeModal = () => {
    setSelectedMaterial(null);
  };

  if (loading) {
    return <MaterialsTableSkeleton />;
  }

  return (
    <>
      <Toaster richColors />
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[35%]">Nombre</TableHead>
            <TableHead className="w-[20%]">Categoría</TableHead>
            <TableHead className="w-[20%]">Unidad</TableHead>
            <TableHead className="text-center w-[13%]">Stock</TableHead>
            <TableHead className="text-center w-[12%]">Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.map((material) => (
            <TableRow
              key={material.id}
              onClick={() => openModal(material)}
              className="cursor-pointer"
            >
              <TableCell>{material.name}</TableCell>
              <TableCell>{material.category}</TableCell>
              <TableCell>{material.unit}</TableCell>
              <TableCell className="text-center">{material.stock}</TableCell>
              <TableCell className="flex justify-center">
                <div
                  className={`w-3 h-3 rounded-full ${
                    material.stock <= material.minimum_stock
                      ? "bg-red-500 animate-pulse"
                      : material.stock <= material.minimum_stock * 1.5
                      ? "bg-yellow-500"
                      : "bg-blue-500"
                  } `}
                ></div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedMaterial && (
        <OutputModal
          material={selectedMaterial}
          closeModal={closeModal}
          updateFunc={updateStock}
        />
      )}
    </>
  );
}
