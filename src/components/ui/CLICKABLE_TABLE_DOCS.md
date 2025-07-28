# Tabla Reutilizable con Filas Clickeables

Este componente `ClickableTable` es una tabla genérica y reutilizable que permite:

- **Filas clickeables** con callback personalizable
- **Columnas configurables** con renderizado personalizado
- **Estados de carga** integrados
- **Mensaje de estado vacío** configurable
- **Estilos personalizables** para filas y encabezados

## Uso Básico

```tsx
import { ClickableTable, TableColumn } from "@/components/ui/clickable-table";

// Definir las columnas
const columns: TableColumn<MiTipo>[] = [
  {
    key: "id",
    label: "ID",
    width: "10%",
  },
  {
    key: "name",
    label: "Nombre",
    width: "30%",
    render: (item) => <div className="font-semibold">{item.name}</div>,
  },
];

// Usar la tabla
<ClickableTable
  data={misDatos}
  columns={columns}
  onRowClick={(item, index) => {
    console.log("Clicked:", item);
  }}
  isLoading={isLoading}
/>;
```

## Propiedades

### `TableColumn<T>`

- `key`: string - Clave del campo en el objeto de datos
- `label`: string - Texto del encabezado de la columna
- `render?`: (item: T) => ReactNode - Función de renderizado personalizada
- `width?`: string - Ancho de la columna (ej: "20%", "200px")
- `className?`: string - Clases CSS adicionales para la columna

### `ClickableTableProps<T>`

- `data`: T[] - Array de datos a mostrar
- `columns`: TableColumn<T>[] - Configuración de columnas
- `onRowClick?`: (item: T, index: number) => void - Callback al hacer clic en una fila
- `isLoading?`: boolean - Estado de carga
- `emptyMessage?`: string - Mensaje cuando no hay datos
- `className?`: string - Clases CSS adicionales para el contenedor
- `rowClassName?`: string | function - Clases CSS para las filas
- `headerClassName?`: string - Clases CSS para el encabezado

## Ejemplos de Uso

### 1. Tabla Básica de Equipos

```tsx
const columns: TableColumn<Equipment>[] = [
  {
    key: "id",
    label: "ID",
    width: "10%",
  },
  {
    key: "model",
    label: "Modelo",
    width: "30%",
  },
  {
    key: "status",
    label: "Estado",
    width: "20%",
    render: (equipment) => (
      <Badge variant={equipment.status === "active" ? "default" : "secondary"}>
        {equipment.status}
      </Badge>
    ),
  },
];

<ClickableTable
  data={equipments}
  columns={columns}
  onRowClick={(equipment) => {
    alert(`Equipo: ${equipment.model}`);
  }}
/>;
```

### 2. Tabla con Estilos Condicionales

```tsx
<ClickableTable
  data={items}
  columns={columns}
  rowClassName={(item) =>
    item.status === "active"
      ? "bg-green-50 hover:bg-green-100"
      : "bg-red-50 hover:bg-red-100"
  }
  onRowClick={(item) => navigate(`/items/${item.id}`)}
/>
```

### 3. Tabla Solo para Mostrar (sin clicks)

```tsx
<ClickableTable
  data={reports}
  columns={reportColumns}
  // Sin onRowClick = filas no clickeables
  emptyMessage="No hay reportes disponibles"
  className="border-2 border-gray-200"
/>
```

### 4. Tabla con Renderizado Complejo

```tsx
const userColumns: TableColumn<User>[] = [
  {
    key: "avatar",
    label: "Usuario",
    width: "25%",
    render: (user) => (
      <div className="flex items-center gap-3">
        <img
          src={user.avatar}
          className="w-8 h-8 rounded-full"
          alt={user.name}
        />
        <div>
          <div className="font-medium">{user.name}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>
      </div>
    ),
  },
  {
    key: "role",
    label: "Rol",
    width: "15%",
    render: (user) => <Badge variant="outline">{user.role}</Badge>,
  },
  {
    key: "lastLogin",
    label: "Último acceso",
    width: "20%",
    render: (user) => (
      <span className="text-sm">
        {format(user.lastLogin, "dd/MM/yyyy HH:mm")}
      </span>
    ),
  },
];
```

## Características Avanzadas

### Manejo de Estados de Carga

La tabla automáticamente muestra un spinner cuando `isLoading` es `true`.

### Mensajes de Estado Vacío

Personaliza el mensaje cuando no hay datos con la prop `emptyMessage`.

### Filas Clickeables Condicionales

```tsx
const handleRowClick = (item: MyType, index: number) => {
  if (item.status === "active") {
    // Solo permitir click en elementos activos
    onItemClick(item);
  }
};
```

### Renderizado Personalizado Avanzado

```tsx
{
  key: "actions",
  label: "Acciones",
  width: "15%",
  render: (item) => (
    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
      <Button size="sm" onClick={() => editItem(item)}>
        Editar
      </Button>
      <Button size="sm" variant="destructive" onClick={() => deleteItem(item)}>
        Eliminar
      </Button>
    </div>
  ),
}
```

> **Nota**: Usa `e.stopPropagation()` en elementos dentro de las celdas para evitar que disparen el `onRowClick` de la fila.
