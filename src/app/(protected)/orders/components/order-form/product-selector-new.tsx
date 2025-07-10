// src/app/orders/components/order-form/product-selector.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LoaderSpin } from "@/components/Loader";
import { Product, OrderItem } from "@/types/orders.types";
import {
  Plus,
  Minus,
  X,
  Search,
  Trash,
  Package,
  CheckCircle,
} from "lucide-react";
import { useDebounce } from "use-debounce";

interface ProductSelectorProps {
  products: Product[];
  selectedItems: OrderItem[];
  onChange: (items: OrderItem[]) => void;
  isLoading: boolean;
}

export default function ProductSelector({
  products,
  selectedItems,
  onChange,
  isLoading,
}: ProductSelectorProps) {
  // Estado para búsqueda de productos
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Estado para el producto seleccionado para añadir
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number | null>(null);
  const [notes, setNotes] = useState<string>("");

  // Actualizar productos filtrados cuando cambia la búsqueda o la lista de productos
  useEffect(() => {
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          (product.description &&
            product.description.toLowerCase().includes(searchLower)) ||
          product.unit.toLowerCase().includes(searchLower)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [debouncedSearchTerm, products]);

  // Seleccionar un producto para añadir
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setNotes("");
  };

  // Añadir producto a la lista de seleccionados
  const handleAddProduct = () => {
    if (selectedProduct && quantity && quantity > 0) {
      const newItem: OrderItem = {
        product_id: selectedProduct.id,
        product_name: selectedProduct.name,
        quantity,
        notes: notes.trim() || undefined,
        unit: selectedProduct.unit,
        size: selectedProduct.size,
      };

      // Verificar si ya existe este producto en la lista
      const existingItemIndex = selectedItems.findIndex(
        (item) => item.product_id === selectedProduct.id
      );

      if (existingItemIndex >= 0) {
        // Actualizar el existente
        const updatedItems = [...selectedItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
          notes: notes.trim() || updatedItems[existingItemIndex].notes,
        };
        onChange(updatedItems);
      } else {
        // Añadir nuevo
        onChange([...selectedItems, newItem]);
      }

      // Limpiar selección
      setSelectedProduct(null);
      setQuantity(1);
      setNotes("");
    }
  };

  // Actualizar cantidad de un item
  const handleUpdateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity <= 0) return; // No permitir cantidades negativas o cero

    const updatedItems = [...selectedItems];
    updatedItems[index] = {
      ...updatedItems[index],
      quantity: newQuantity,
    };
    onChange(updatedItems);
  };

  // Eliminar un item
  const handleRemoveItem = (index: number) => {
    const updatedItems = selectedItems.filter((_, i) => i !== index);
    onChange(updatedItems);
  };

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardHeader className="px-0 pb-6">
        <CardTitle className="text-lg font-semibold text-gray-900">
          Selección de Productos
        </CardTitle>
        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar productos por nombre o descripción..."
              className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-0 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lista de productos disponibles */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-500" />
              Productos Disponibles
            </h3>
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
              <div className="h-80 overflow-y-auto">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <LoaderSpin text="" />
                    <p className="text-gray-500 mt-3">Cargando productos...</p>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <Package className="h-8 w-8 mb-3 text-gray-300" />
                    <p>No se encontraron productos</p>
                    {searchTerm && (
                      <p className="text-sm mt-1">
                        Intente con otros términos de búsqueda
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className={`
                          p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-sm
                          ${
                            selectedProduct?.id === product.id
                              ? "border-blue-500 bg-blue-50 shadow-sm"
                              : "border-gray-200 bg-white hover:border-blue-300"
                          }
                        `}
                        onClick={() => handleSelectProduct(product)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {product.name}
                            </p>
                            {product.description && (
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {product.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                                {product.unit}
                              </span>
                              {product.size && (
                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-700">
                                  {product.size}
                                </span>
                              )}
                            </div>
                          </div>
                          {selectedProduct?.id === product.id && (
                            <div className="ml-2">
                              <div className="flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full">
                                <Plus className="h-3 w-3 text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Panel de agregar producto */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <Plus className="h-4 w-4 text-green-500" />
              Agregar al Pedido
            </h3>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              {selectedProduct ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="font-medium text-gray-900">
                      {selectedProduct.name}
                    </p>
                    {selectedProduct.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedProduct.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                        {selectedProduct.unit}
                      </span>
                      {selectedProduct.size && (
                        <span className="text-xs bg-blue-200 px-2 py-1 rounded">
                          {selectedProduct.size}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div>
                      <Label
                        htmlFor="quantity"
                        className="text-sm font-medium text-gray-700"
                      >
                        Cantidad *
                      </Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        step="1"
                        value={quantity || ""}
                        onChange={(e) =>
                          setQuantity(Number(e.target.value) || null)
                        }
                        placeholder="Ingrese cantidad"
                        className="mt-1 h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="notes"
                        className="text-sm font-medium text-gray-700"
                      >
                        Notas adicionales
                      </Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Notas opcionales para este producto..."
                        rows={3}
                        className="mt-1 border-gray-200 focus:border-blue-500 focus:ring-blue-500 resize-none"
                      />
                    </div>

                    <Button
                      onClick={handleAddProduct}
                      disabled={!quantity || quantity <= 0}
                      className="w-full h-10 bg-green-600 hover:bg-green-700 gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Agregar al Pedido
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                  <Package className="h-8 w-8 mb-3 text-gray-300" />
                  <p className="text-center">
                    Seleccione un producto para agregarlo al pedido
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lista de productos seleccionados */}
        {selectedItems.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Productos en el Pedido ({selectedItems.length})
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onChange([])}
                className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash className="h-4 w-4" />
                Limpiar Todo
              </Button>
            </div>

            <div className="bg-green-50 rounded-xl border border-green-200 p-4">
              <div className="space-y-3">
                {selectedItems.map((item, index) => (
                  <div
                    key={`${item.product_id}-${index}`}
                    className="flex items-center justify-between bg-white rounded-lg p-3 border border-green-200"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">
                        {item.product_name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {item.unit}
                        </span>
                        {item.size && (
                          <span className="text-xs bg-blue-100 px-2 py-1 rounded">
                            {item.size}
                          </span>
                        )}
                      </div>
                      {item.notes && (
                        <p className="text-sm text-gray-600 mt-1 italic">
                          Nota: {item.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 ml-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleUpdateQuantity(index, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 p-0"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-12 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleUpdateQuantity(index, item.quantity + 1)
                          }
                          className="w-8 h-8 p-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveItem(index)}
                        className="w-8 h-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedItems.length === 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex gap-3">
              <div className="flex items-center justify-center w-6 h-6 bg-amber-100 rounded-full flex-shrink-0 mt-0.5">
                <span className="text-amber-600 text-sm font-bold">!</span>
              </div>
              <div>
                <p className="text-sm text-amber-800 font-medium">
                  Sin productos seleccionados
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  Debe agregar al menos un producto para continuar con el
                  pedido.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
