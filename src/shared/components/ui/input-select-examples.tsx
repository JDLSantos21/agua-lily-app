// Ejemplos de uso del componente InputSelect

import { InputSelect } from "./input-select";
import { useState } from "react";

// Ejemplo 1: Lista de materiales
const materials = [
  { id: 1, name: "Cemento", category: "Construcción" },
  { id: 2, name: "Arena", category: "Construcción" },
  { id: 3, name: "Grava", category: "Construcción" },
];

// Ejemplo 2: Lista de empleados
const employees = [
  { id: "emp1", name: "Juan Pérez", position: "Conductor" },
  { id: "emp2", name: "María García", position: "Operador" },
  { id: "emp3", name: "Carlos López", position: "Supervisor" },
];

// Ejemplo 3: Lista de vehículos con propiedades personalizadas
const vehicles = [
  { vehicleId: "V001", model: "Mercedes Actros", plate: "ABC-123", year: 2022 },
  { vehicleId: "V002", model: "Volvo FH", plate: "XYZ-789", year: 2021 },
  { vehicleId: "V003", model: "Scania R500", plate: "DEF-456", year: 2023 },
];

export function InputSelectExamples() {
  const [selectedMaterial, setSelectedMaterial] = useState<number | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold">Ejemplos de InputSelect</h2>

      {/* Ejemplo 1: Materiales (uso básico) */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">1. Seleccionar Material</h3>
        <InputSelect
          data={materials}
          selectedValue={selectedMaterial}
          onSelect={(item) => setSelectedMaterial((item?.id as number) || null)}
          placeholder="Selecciona un material..."
          searchPlaceholder="Buscar material..."
          emptyMessage="No se encontró material."
        />
        {selectedMaterial && (
          <p className="text-sm text-gray-600">
            Material seleccionado:{" "}
            {materials.find((m) => m.id === selectedMaterial)?.name}
          </p>
        )}
      </div>

      {/* Ejemplo 2: Empleados (con id string) */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">2. Seleccionar Empleado</h3>
        <InputSelect
          data={employees}
          selectedValue={selectedEmployee}
          onSelect={(item) => setSelectedEmployee((item?.id as string) || null)}
          placeholder="Selecciona un empleado..."
          searchPlaceholder="Buscar empleado..."
          emptyMessage="No se encontró empleado."
          className="max-w-md"
        />
        {selectedEmployee && (
          <p className="text-sm text-gray-600">
            Empleado seleccionado:{" "}
            {employees.find((e) => e.id === selectedEmployee)?.name}
          </p>
        )}
      </div>

      {/* Ejemplo 3: Vehículos (con propiedades personalizadas) */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">
          3. Seleccionar Vehículo (Propiedades Personalizadas)
        </h3>
        <InputSelect
          data={vehicles.map((v) => ({
            ...v,
            id: v.vehicleId,
            name: `${v.model} - ${v.plate}`,
          }))}
          selectedValue={selectedVehicle}
          onSelect={(item) => setSelectedVehicle((item?.id as string) || null)}
          placeholder="Selecciona un vehículo..."
          searchPlaceholder="Buscar vehículo..."
          emptyMessage="No se encontró vehículo."
          displayProperty="name"
          valueProperty="id"
        />
        {selectedVehicle && (
          <p className="text-sm text-gray-600">
            Vehículo seleccionado:{" "}
            {vehicles.find((v) => v.vehicleId === selectedVehicle)?.model}
          </p>
        )}
      </div>
    </div>
  );
}
