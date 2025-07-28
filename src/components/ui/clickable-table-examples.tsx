"use client";
import React, { useState } from "react";
import { CustomTable, TableColumn } from "@/components/ui/custom-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye, User, Mail } from "lucide-react";

// Tipos de ejemplo
interface ExampleUser {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user" | "moderator";
  status: "active" | "inactive";
  lastLogin: string;
  avatar?: string;
}

interface ExampleProduct {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  status: "available" | "out_of_stock" | "discontinued";
}

export function CustomTableExamples() {
  const [selectedUser, setSelectedUser] = useState<ExampleUser | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ExampleProduct | null>(
    null
  );

  // Datos de ejemplo
  const users: ExampleUser[] = [
    {
      id: 1,
      name: "Juan Pérez",
      email: "juan@example.com",
      role: "admin",
      status: "active",
      lastLogin: "2024-01-15T10:30:00Z",
    },
    {
      id: 2,
      name: "María García",
      email: "maria@example.com",
      role: "user",
      status: "active",
      lastLogin: "2024-01-14T15:45:00Z",
    },
    {
      id: 3,
      name: "Carlos López",
      email: "carlos@example.com",
      role: "moderator",
      status: "inactive",
      lastLogin: "2024-01-10T09:20:00Z",
    },
  ];

  const products: ExampleProduct[] = [
    {
      id: 1,
      name: "Laptop Dell XPS 13",
      price: 999.99,
      category: "Electrónicos",
      stock: 15,
      status: "available",
    },
    {
      id: 2,
      name: "Mouse Inalámbrico",
      price: 29.99,
      category: "Accesorios",
      stock: 0,
      status: "out_of_stock",
    },
    {
      id: 3,
      name: "Teclado Mecánico",
      price: 79.99,
      category: "Accesorios",
      stock: 8,
      status: "available",
    },
  ];

  // Columnas para usuarios
  const userColumns: TableColumn<ExampleUser>[] = [
    {
      key: "name",
      label: "Usuario",
      width: "30%",
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{user.name}</div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Mail className="h-3 w-3" />
              {user.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Rol",
      width: "15%",
      render: (user) => {
        const roleColors = {
          admin: "bg-red-100 text-red-800",
          moderator: "bg-yellow-100 text-yellow-800",
          user: "bg-blue-100 text-blue-800",
        };
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}
          >
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </span>
        );
      },
    },
    {
      key: "status",
      label: "Estado",
      width: "15%",
      render: (user) => (
        <Badge variant={user.status === "active" ? "default" : "secondary"}>
          {user.status === "active" ? "Activo" : "Inactivo"}
        </Badge>
      ),
    },
    {
      key: "lastLogin",
      label: "Último acceso",
      width: "20%",
      render: (user) => (
        <span className="text-sm text-gray-600">
          {new Date(user.lastLogin).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Acciones",
      width: "20%",
      render: (user) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            variant="outline"
            onClick={() => alert(`Ver ${user.name}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => alert(`Editar ${user.name}`)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => alert(`Eliminar ${user.name}`)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  // Columnas para productos
  const productColumns: TableColumn<ExampleProduct>[] = [
    {
      key: "name",
      label: "Producto",
      width: "35%",
      render: (product) => (
        <div>
          <div className="font-medium text-gray-900">{product.name}</div>
          <div className="text-sm text-gray-500">{product.category}</div>
        </div>
      ),
    },
    {
      key: "price",
      label: "Precio",
      width: "15%",
      render: (product) => (
        <span className="font-semibold text-green-600">
          ${product.price.toFixed(2)}
        </span>
      ),
    },
    {
      key: "stock",
      label: "Stock",
      width: "15%",
      render: (product) => (
        <div className="text-center">
          <span
            className={`px-2 py-1 rounded-full text-sm font-medium ${
              product.stock > 10
                ? "bg-green-100 text-green-800"
                : product.stock > 0
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
            }`}
          >
            {product.stock}
          </span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Estado",
      width: "20%",
      render: (product) => {
        const statusConfig = {
          available: { variant: "default" as const, label: "Disponible" },
          out_of_stock: { variant: "destructive" as const, label: "Agotado" },
          discontinued: {
            variant: "secondary" as const,
            label: "Descontinuado",
          },
        };
        const config = statusConfig[product.status];
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
    {
      key: "actions",
      label: "Acciones",
      width: "15%",
      render: (product) => (
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            alert(`Gestionar ${product.name}`);
          }}
        >
          Gestionar
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Ejemplos de Tabla Reutilizable
        </h1>
        <p className="text-gray-600">
          Diferentes configuraciones y usos del componente CustomTable
        </p>
      </div>

      {/* Ejemplo 1: Tabla de Usuarios */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            1. Tabla de Usuarios con Acciones
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Tabla con renderizado personalizado, estilos condicionales y botones
            de acción.
            {selectedUser && (
              <span className="ml-2 font-medium text-blue-600">
                Último usuario seleccionado: {selectedUser.name}
              </span>
            )}
          </p>
        </div>
        <CustomTable
          data={users}
          columns={userColumns}
          onRowClick={(user) => {
            setSelectedUser(user);
            console.log("Usuario seleccionado:", user);
          }}
          rowClassName={(user) =>
            user.status === "active"
              ? "hover:bg-green-50 cursor-pointer transition-colors"
              : "hover:bg-red-50 cursor-pointer transition-colors opacity-75"
          }
          className="border rounded-none shadow-sm"
          emptyMessage="No hay usuarios registrados"
        />
      </div>

      {/* Ejemplo 2: Tabla de Productos */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            2. Tabla de Productos con Estados
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Tabla que muestra diferentes estados de producto con códigos de
            colores.
            {selectedProduct && (
              <span className="ml-2 font-medium text-green-600">
                Último producto seleccionado: {selectedProduct.name}
              </span>
            )}
          </p>
        </div>
        <CustomTable
          data={products}
          columns={productColumns}
          onRowClick={(product) => {
            setSelectedProduct(product);
            console.log("Producto seleccionado:", product);
          }}
          className="border rounded-lg shadow-sm"
          headerClassName="bg-gray-50 border-b-2 border-gray-200"
          emptyMessage="No hay productos disponibles"
        />
      </div>

      {/* Ejemplo 3: Tabla Simple */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            3. Tabla Simple (Solo Lectura)
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Tabla básica sin clicks, solo para mostrar información.
          </p>
        </div>
        <CustomTable
          data={users.slice(0, 2)}
          columns={[
            { key: "id", label: "ID", width: "10%" },
            { key: "name", label: "Nombre", width: "40%" },
            { key: "email", label: "Email", width: "40%" },
            { key: "role", label: "Rol", width: "10%" },
          ]}
          // Sin onRowClick = no clickeable
          className="border rounded-lg"
          rowClassName="hover:bg-gray-50"
        />
      </div>

      {/* Ejemplo 4: Tabla con Estado de Carga */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            4. Estado de Carga
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Demostración del estado de carga de la tabla.
          </p>
        </div>
        <CustomTable
          data={[]}
          columns={userColumns}
          isLoading={true}
          className="border rounded-lg h-32"
        />
      </div>
    </div>
  );
}
