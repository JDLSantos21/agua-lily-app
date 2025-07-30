"use client";

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
import { useState } from "react";

interface SelectItem {
  [key: string]: any; // Para permitir propiedades adicionales
}

interface InputSelectProps {
  data: SelectItem[];
  onSelect: (item: SelectItem | null) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  displayProperty?: keyof SelectItem; // Propiedad a mostrar (por defecto 'name')
  valueProperty?: keyof SelectItem; // Propiedad para el valor (por defecto 'id')
  selectedValue?: string | number | null; // Valor seleccionado desde el exterior
  allowClear?: boolean; // Permitir deseleccionar
  clearText?: string; // Texto para la opción de limpiar
}

export function InputSelect({
  data,
  onSelect,
  placeholder = "Selecciona una opción...",
  searchPlaceholder = "Buscar...",
  emptyMessage = "No se encontraron resultados.",
  className = "",
  displayProperty = "name",
  valueProperty = "id",
  selectedValue = null,
  allowClear = false,
  clearText = "Sin selección",
}: InputSelectProps) {
  const [open, setOpen] = useState(false);

  // Encontrar el item seleccionado basado en selectedValue
  const selectedItem = selectedValue
    ? data.find((item) => item[valueProperty] === selectedValue) || null
    : null;

  const handleSelectItem = (item: SelectItem) => {
    onSelect(item);
    setOpen(false);
  };

  const handleClearSelection = () => {
    onSelect(null);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            `w-full justify-between outline-blue-200 h-10 font-normal  `,
            className
          )}
        >
          {selectedItem ? selectedItem[displayProperty] : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 bg-white border border-gray-200 shadow-md"
        style={{ width: "var(--radix-popover-trigger-width)" }}
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="h-9" />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {allowClear && (
                <CommandItem
                  key="clear-selection"
                  value={clearText}
                  onSelect={handleClearSelection}
                  className="text-gray-500 italic"
                >
                  {clearText}
                  <Check
                    className={cn(
                      "ml-auto",
                      !selectedItem ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              )}
              {data.map((item) => (
                <CommandItem
                  key={item[valueProperty]}
                  value={String(item[displayProperty])}
                  onSelect={() => handleSelectItem(item)}
                >
                  {String(item[displayProperty])}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedItem?.[valueProperty] === item[valueProperty]
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
