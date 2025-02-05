"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Material {
  id: number;
  name: string;
}

interface MaterialComboboxProps {
  materials: Material[];
  onSelect: (material: Material | null) => void;
}

export function MaterialCombobox({
  materials,
  onSelect,
}: MaterialComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedMaterial, setSelectedMaterial] =
    React.useState<Material | null>(null);

  const handleSelect = (materialId: string) => {
    const material =
      materials.find((m) => m.id.toString() === materialId) || null;
    setSelectedMaterial(material);
    onSelect(material);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedMaterial
            ? selectedMaterial.name
            : "Selecciona un material..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Buscar material..." className="h-9" />
          <CommandList>
            <CommandEmpty>No se encontró material.</CommandEmpty>
            <CommandGroup>
              {materials.map((material) => (
                <CommandItem
                  key={material.id}
                  value={material.id.toString()}
                  onSelect={(currentValue) => {
                    handleSelect(currentValue);
                  }}
                >
                  {material.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedMaterial?.id.toString() === material.id.toString()
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
