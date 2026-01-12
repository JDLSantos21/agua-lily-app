"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  subDays,
  subWeeks,
  subMonths,
  startOfDay,
  endOfDay,
} from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { DateRangePreset } from "@/types/orders.types";

interface DateRangeSelectorProps {
  value: { start_date: string; end_date: string };
  onChange: (range: { start_date: string; end_date: string }) => void;
  className?: string;
}

interface PresetOption {
  value: DateRangePreset;
  label: string;
  getDates: () => { start: Date; end: Date };
}

const PRESET_OPTIONS: PresetOption[] = [
  {
    value: "today",
    label: "Hoy",
    getDates: () => {
      const today = new Date();
      return { start: startOfDay(today), end: endOfDay(today) };
    },
  },
  {
    value: "yesterday",
    label: "Ayer",
    getDates: () => {
      const yesterday = subDays(new Date(), 1);
      return { start: startOfDay(yesterday), end: endOfDay(yesterday) };
    },
  },
  {
    value: "this_week",
    label: "Esta semana",
    getDates: () => {
      const today = new Date();
      return {
        start: startOfWeek(today, { weekStartsOn: 1 }),
        end: endOfWeek(today, { weekStartsOn: 1 }),
      };
    },
  },
  {
    value: "last_week",
    label: "Semana pasada",
    getDates: () => {
      const lastWeek = subWeeks(new Date(), 1);
      return {
        start: startOfWeek(lastWeek, { weekStartsOn: 1 }),
        end: endOfWeek(lastWeek, { weekStartsOn: 1 }),
      };
    },
  },
  {
    value: "this_month",
    label: "Este mes",
    getDates: () => {
      const today = new Date();
      return { start: startOfMonth(today), end: new Date() };
    },
  },
  {
    value: "last_month",
    label: "Mes pasado",
    getDates: () => {
      const lastMonth = subMonths(new Date(), 1);
      return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) };
    },
  },
  {
    value: "this_year",
    label: "Este año",
    getDates: () => {
      const today = new Date();
      return { start: new Date(today.getFullYear(), 0, 1), end: today };
    },
  },
];

export function DateRangeSelector({
  value,
  onChange,
  className,
}: DateRangeSelectorProps) {
  const [selectedPreset, setSelectedPreset] =
    useState<DateRangePreset>("this_month");
  const [isCustom, setIsCustom] = useState(false);
  const [customRange, setCustomRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });

  // Detectar el preset actual basado en las fechas
  const currentPresetLabel = useMemo(() => {
    if (isCustom) return "Personalizado";
    const preset = PRESET_OPTIONS.find((p) => p.value === selectedPreset);
    return preset?.label || "Este mes";
  }, [selectedPreset, isCustom]);

  const handlePresetChange = (preset: DateRangePreset) => {
    const option = PRESET_OPTIONS.find((p) => p.value === preset);
    if (!option) return;

    const dates = option.getDates();
    setSelectedPreset(preset);
    setIsCustom(false);

    onChange({
      start_date: format(dates.start, "yyyy-MM-dd"),
      end_date: format(dates.end, "yyyy-MM-dd"),
    });
  };

  const handleCustomRangeChange = (range: {
    from: Date | undefined;
    to: Date | undefined;
  }) => {
    setCustomRange(range);

    if (range.from && range.to) {
      setIsCustom(true);
      onChange({
        start_date: format(range.from, "yyyy-MM-dd"),
        end_date: format(range.to, "yyyy-MM-dd"),
      });
    }
  };

  const displayDateRange = useMemo(() => {
    if (!value.start_date || !value.end_date) return "Seleccionar rango";

    // Parsear fechas como fechas locales para evitar problemas de zona horaria
    const [startYear, startMonth, startDay] = value.start_date
      .split("-")
      .map(Number);
    const [endYear, endMonth, endDay] = value.end_date.split("-").map(Number);

    const start = new Date(startYear, startMonth - 1, startDay);
    const end = new Date(endYear, endMonth - 1, endDay);

    return `${format(start, "dd MMM", { locale: es })} - ${format(end, "dd MMM yyyy", { locale: es })}`;
  }, [value]);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal min-w-[240px]",
              !value.start_date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span className="flex-1">{displayDateRange}</span>
            <span className="text-xs text-muted-foreground ml-2">
              ({currentPresetLabel})
            </span>
            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            {/* Sidebar con presets */}
            <div className="border-r p-3 space-y-1 max-w-[145px]">
              <div className="text-xs font-semibold text-muted-foreground mb-2 px-2">
                Rangos rápidos
              </div>
              {PRESET_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start text-sm",
                    selectedPreset === option.value && !isCustom && "bg-accent"
                  )}
                  onClick={() => handlePresetChange(option.value)}
                >
                  {option.label}
                </Button>
              ))}
              <div className="border-t pt-2 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "w-full justify-start text-sm",
                    isCustom && "bg-accent"
                  )}
                  onClick={() => setIsCustom(true)}
                >
                  Personalizado
                </Button>
              </div>
            </div>

            {/* Calendario para rango personalizado */}
            <div className="p-3">
              <Calendar
                mode="range"
                selected={{
                  from:
                    customRange.from ||
                    (value.start_date
                      ? (() => {
                          const [year, month, day] = value.start_date
                            .split("-")
                            .map(Number);
                          return new Date(year, month - 1, day);
                        })()
                      : undefined),
                  to:
                    customRange.to ||
                    (value.end_date
                      ? (() => {
                          const [year, month, day] = value.end_date
                            .split("-")
                            .map(Number);
                          return new Date(year, month - 1, day);
                        })()
                      : undefined),
                }}
                onSelect={(range) => {
                  if (range) {
                    handleCustomRangeChange({ from: range.from, to: range.to });
                  }
                }}
                locale={es}
                numberOfMonths={2}
                disabled={(date) => date > new Date()}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
