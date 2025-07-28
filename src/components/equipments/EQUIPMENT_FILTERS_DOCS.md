# Sistema de Filtros para Equipos

Este sistema de filtros proporciona una solución completa y escalable para filtrar equipos con las mejores prácticas de desarrollo.

## 🏗️ Arquitectura

### Separación de Responsabilidades

```
📁 hooks/
  ├── useEquipments.ts          # Hook base para obtener equipos
  └── useEquipmentFilters.ts    # Hook compuesto para manejo de filtros

📁 components/equipments/
  └── EquipmentFilters.tsx      # Componente UI de filtros

📁 types/
  └── equipments.types.ts       # Tipos TypeScript

📁 api/
  └── equipments.ts             # Capa de API
```

## 🔧 Componentes

### 1. Tipos (`equipments.types.ts`)

```typescript
// Filtros para la API
export interface EquipmentFilter {
  type?: string;
  status?: string;
  customer_id?: number;
  search?: string;
  limit?: number;
  offset?: number;
}

// Filtros para el formulario UI
export interface EquipmentFilterFormData {
  type: string;
  status: string;
  search: string;
}
```

### 2. Hook Base (`useEquipments.ts`)

```typescript
// Hook simple que acepta filtros opcionales
export function useEquipments(filters?: EquipmentFilter) {
  return useQuery({
    queryKey: ["equipments", filters],
    queryFn: () => getEquipments(filters),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}
```

### 3. Hook Compuesto (`useEquipmentFilters.ts`)

```typescript
// Hook que combina estado de filtros + datos
export function useEquipmentFilters() {
  // Estado local de filtros
  const [filters, setFilters] = useState<EquipmentFilterFormData>({...});

  // Conversión a filtros de API
  const apiFilters = useMemo(() => {...}, [filters]);

  // Obtención de datos
  const equipmentsQuery = useEquipments(apiFilters);

  // Funciones auxiliares
  return {
    data, isLoading, isError,
    filters, updateFilters, clearFilters,
    hasActiveFilters, filterStats
  };
}
```

### 4. Componente de Filtros (`EquipmentFilters.tsx`)

```typescript
interface EquipmentFiltersProps {
  onFilterChange: (filters: EquipmentFilterFormData) => void;
  isLoading?: boolean;
  className?: string;
}
```

## 🚀 Características

### ✨ Funcionalidades Implementadas

- **Búsqueda en tiempo real** con debounce (300ms)
- **Filtros por tipo y estado** con selects
- **Indicadores visuales** de filtros activos
- **Limpieza de filtros** con un clic
- **Estados de carga** integrados
- **TypeScript completo** para type safety
- **Optimización de queries** con React Query

### 🎯 Filtros Disponibles

1. **Búsqueda General**

   - Busca en: número de serie, modelo, marca, nombre de cliente
   - Debounce de 300ms para optimización

2. **Tipo de Equipo**

   - Dispensador, Enfriador, Bomba, Botellón, Filtro
   - Opción "Todos los tipos"

3. **Estado**
   - Activo, Inactivo, Mantenimiento, Dañado
   - Opción "Todos los estados"

## 📋 Uso

### En tu página de equipos:

```tsx
export default function EquipmentsPage() {
  // Un solo hook maneja todo
  const {
    data,
    isLoading,
    isError,
    updateFilters,
    hasActiveFilters,
    filterStats,
  } = useEquipmentFilters();

  return (
    <div>
      {/* Componente de filtros */}
      <EquipmentFilters onFilterChange={updateFilters} isLoading={isLoading} />

      {/* Tabla con datos filtrados */}
      <CustomTable
        data={data?.data || []}
        // ... resto de props
      />
    </div>
  );
}
```

### En otros lugares:

```tsx
// Solo necesitas datos sin filtros
const { data, isLoading } = useEquipments();

// Con filtros específicos
const { data, isLoading } = useEquipments({
  type: "dispenser",
  status: "active",
});

// Sistema completo de filtros
const equipmentFilters = useEquipmentFilters();
```

## 🔄 Flujo de Datos

```
1. Usuario interactúa con EquipmentFilters
2. onFilterChange actualiza estado en useEquipmentFilters
3. useMemo convierte filtros UI → filtros API
4. useEquipments se ejecuta con nuevos filtros
5. React Query gestiona cache y optimizaciones
6. UI se actualiza automáticamente
```

## 🛠️ Extensibilidad

### Agregar Nuevos Filtros

1. **Actualizar tipos:**

```typescript
export interface EquipmentFilterFormData {
  type: string;
  status: string;
  search: string;
  brand: string; // ← Nuevo filtro
}
```

2. **Actualizar componente de filtros:**

```tsx
// Agregar nuevo select o input en EquipmentFilters.tsx
```

3. **Actualizar conversión en hook:**

```typescript
if (filters.brand) result.brand = filters.brand;
```

### Agregar Paginación

```typescript
const useEquipmentFiltersWithPagination = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const apiFilters = useMemo(
    () => ({
      ...baseFilters,
      limit,
      offset: (page - 1) * limit,
    }),
    [baseFilters, page, limit]
  );

  // ... resto de la lógica
};
```

## 🎨 Personalización

### Estilos del Componente de Filtros

```tsx
<EquipmentFilters
  className="mb-4 border-2 border-blue-200"
  onFilterChange={updateFilters}
/>
```

### Opciones de Filtros Personalizadas

```typescript
// En EquipmentFilters.tsx, modifica:
const EQUIPMENT_TYPES = [
  { value: "", label: "Todos los tipos" },
  { value: "custom", label: "Mi Tipo Personalizado" },
  // ...
];
```

## ⚡ Optimizaciones

- **React Query** para cache automático
- **useMemo** para evitar re-renderizados innecesarios
- **Debounce** en búsqueda para reducir requests
- **Lazy loading** ready para paginación
- **TypeScript** para detectar errores en desarrollo

Este sistema es escalable, mantenible y sigue las mejores prácticas de React y TypeScript.
