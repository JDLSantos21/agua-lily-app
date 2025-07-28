# InputSelect Component

Un componente de selección reutilizable y genérico basado en Radix UI que puede ser usado en cualquier parte de tu aplicación.

## Características

- ✅ Completamente tipado con TypeScript
- ✅ Búsqueda integrada
- ✅ Soporte para cualquier tipo de datos
- ✅ Propiedades personalizables para mostrar y valores
- ✅ Mensajes y placeholders configurables
- ✅ Estilos personalizables
- ✅ Control externo del valor seleccionado

## Props

| Prop                | Tipo                                 | Requerido | Default                           | Descripción                                   |
| ------------------- | ------------------------------------ | --------- | --------------------------------- | --------------------------------------------- |
| `data`              | `SelectItem[]`                       | ✅        | -                                 | Array de objetos a mostrar en el select       |
| `onSelect`          | `(item: SelectItem \| null) => void` | ✅        | -                                 | Función que se ejecuta al seleccionar un item |
| `selectedValue`     | `string \| number \| null`           | ❌        | `null`                            | Valor actualmente seleccionado                |
| `placeholder`       | `string`                             | ❌        | `"Selecciona una opción..."`      | Texto mostrado cuando no hay selección        |
| `searchPlaceholder` | `string`                             | ❌        | `"Buscar..."`                     | Placeholder del campo de búsqueda             |
| `emptyMessage`      | `string`                             | ❌        | `"No se encontraron resultados."` | Mensaje cuando no hay resultados              |
| `className`         | `string`                             | ❌        | `""`                              | Clases CSS adicionales para el botón          |
| `displayProperty`   | `keyof SelectItem`                   | ❌        | `"name"`                          | Propiedad a mostrar en el select              |
| `valueProperty`     | `keyof SelectItem`                   | ❌        | `"id"`                            | Propiedad usada como valor único              |

## Tipo SelectItem

```typescript
interface SelectItem {
  id: number | string;
  name: string;
  [key: string]: any; // Propiedades adicionales opcionales
}
```

## Ejemplos de Uso

### Uso Básico

```tsx
import { InputSelect } from "@/shared/components/ui/input-select";

const materials = [
  { id: 1, name: "Cemento" },
  { id: 2, name: "Arena" },
  { id: 3, name: "Grava" },
];

function MyComponent() {
  const [selectedMaterial, setSelectedMaterial] = useState<number | null>(null);

  return (
    <InputSelect
      data={materials}
      selectedValue={selectedMaterial}
      onSelect={(item) => setSelectedMaterial((item?.id as number) || null)}
      placeholder="Selecciona un material..."
    />
  );
}
```

### Uso con Propiedades Personalizadas

```tsx
const vehicles = [
  { vehicleId: "V001", model: "Mercedes Actros", plate: "ABC-123" },
  { vehicleId: "V002", model: "Volvo FH", plate: "XYZ-789" },
];

// Mapear para que coincida con la interfaz SelectItem
const vehicleData = vehicles.map((v) => ({
  id: v.vehicleId,
  name: `${v.model} - ${v.plate}`,
  ...v,
}));

<InputSelect
  data={vehicleData}
  selectedValue={selectedVehicle}
  onSelect={(item) => setSelectedVehicle((item?.id as string) || null)}
  displayProperty="name"
  valueProperty="id"
  placeholder="Selecciona un vehículo..."
  searchPlaceholder="Buscar vehículo..."
  emptyMessage="No se encontró vehículo."
/>;
```

### Uso con Datos Complejos

```tsx
const employees = [
  {
    id: "emp1",
    name: "Juan Pérez",
    position: "Conductor",
    department: "Logística",
  },
  {
    id: "emp2",
    name: "María García",
    position: "Operador",
    department: "Producción",
  },
];

<InputSelect
  data={employees}
  selectedValue={selectedEmployee}
  onSelect={(item) => {
    setSelectedEmployee((item?.id as string) || null);
    // Acceder a propiedades adicionales
    console.log("Posición:", item?.position);
    console.log("Departamento:", item?.department);
  }}
  className="max-w-md"
/>;
```

## Casos de Uso Comunes

1. **Selección de Materiales**: Para inventario y órdenes
2. **Selección de Empleados**: Para asignaciones y reportes
3. **Selección de Vehículos**: Para gestión de flota
4. **Selección de Clientes**: Para órdenes y facturación
5. **Selección de Equipos**: Para mantenimiento y asignaciones

## Notas Importantes

- El componente requiere que los datos tengan al menos las propiedades `id` y `name`
- El `selectedValue` debe coincidir con el valor de la propiedad especificada en `valueProperty`
- El componente es controlado, por lo que necesitas manejar el estado externamente
- Usa `displayProperty` y `valueProperty` para personalizar qué propiedades usar
