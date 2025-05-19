// src/app/orders/components/order-form/product-selector.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LoaderSpin } from "@/components/Loader";
import { Empty } from "@/components/Empty";
import { Product, OrderItem } from "@/types/orders.types";
import { Plus, Minus, X, Search, Package, Trash } from "lucide-react";
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
  const [quantity, setQuantity] = useState<number>(1);
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
    if (selectedProduct && quantity > 0) {
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
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Selector de productos */}
        <div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-md flex items-center gap-1">
                <Package className="h-4 w-4" />
                Seleccionar Productos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Buscador */}
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar producto..."
                  className="pl-8 pr-8"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
                    aria-label="Limpiar búsqueda"
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Lista de productos */}
              <div className="h-64 overflow-y-auto border rounded-md">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <LoaderSpin text="Cargando productos..." />
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <Empty
                      title="No hay productos"
                      description={
                        searchTerm
                          ? "No se encontraron productos con ese término"
                          : "No hay productos disponibles"
                      }
                      className="py-4"
                    />
                  </div>
                ) : (
                  <ul className="divide-y">
                    {filteredProducts.map((product) => (
                      <li
                        key={product.id}
                        className={`
                          p-3 cursor-pointer hover:bg-gray-50 transition
                          ${selectedProduct?.id === product.id ? "bg-primary/10" : ""}
                        `}
                        onClick={() => handleSelectProduct(product)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-xs text-gray-500">
                              {product.size && `${product.size} `}
                              {product.unit}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectProduct(product);
                            }}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Detalles del producto seleccionado */}
              {selectedProduct && (
                <div className="border rounded-md p-3 bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{selectedProduct.name}</h3>
                      <p className="text-xs text-gray-500">
                        {selectedProduct.size && `${selectedProduct.size} `}
                        {selectedProduct.unit}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-400"
                      onClick={() => setSelectedProduct(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mt-3 space-y-3">
                    <div>
                      <Label htmlFor="quantity" className="text-xs">
                        Cantidad
                      </Label>
                      <div className="flex items-center mt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          id="quantity"
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={(e) =>
                            setQuantity(parseInt(e.target.value) || 1)
                          }
                          className="h-8 text-center mx-2 w-16"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => setQuantity(quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes" className="text-xs">
                        Notas (opcional)
                      </Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Instrucciones o comentarios específicos"
                        className="mt-1 text-sm"
                        rows={2}
                      />
                    </div>

                    <Button
                      className="w-full"
                      size="sm"
                      onClick={handleAddProduct}
                    >
                      Añadir a Pedido
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Lista de productos seleccionados */}
        <div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-md flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  Productos en este Pedido
                </span>
                {selectedItems.length > 0 && (
                  <Badge variant="secondary">
                    {selectedItems.length}{" "}
                    {selectedItems.length === 1 ? "producto" : "productos"}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedItems.length === 0 ? (
                <div className="py-8 text-center text-gray-500 border border-dashed rounded-md">
                  <Package className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                  <p>No hay productos añadidos al pedido</p>
                  <p className="text-xs mt-1">
                    Seleccione productos del panel izquierdo
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <ul className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {selectedItems.map((item, index) => {
                      // Encontrar datos completos del producto
                      const productData = products.find(
                        (p) => p.id === item.product_id
                      );

                      return (
                        <li
                          key={index}
                          className="border rounded-md p-3 relative"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">
                                {item.product_name || productData?.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {productData?.size && `${productData.size} `}
                                {productData?.unit || item.unit}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleRemoveItem(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="mt-2 flex items-center">
                            <div className="flex items-center">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() =>
                                  handleUpdateQuantity(
                                    index,
                                    Math.max(1, item.quantity - 1)
                                  )
                                }
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="mx-2 min-w-[30px] text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() =>
                                  handleUpdateQuantity(index, item.quantity + 1)
                                }
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          {item.notes && (
                            <div className="mt-2 text-xs bg-gray-50 p-2 rounded">
                              {item.notes}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>

                  <Separator />

                  <div className="flex justify-between items-center text-sm">
                    <span>Total de productos:</span>
                    <span className="font-medium">
                      {selectedItems.reduce(
                        (acc, item) => acc + item.quantity,
                        0
                      )}{" "}
                      unidades
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-red-500 hover:text-red-700 hover:bg-red-50 mt-2 gap-1"
                    onClick={() => onChange([])}
                  >
                    <Trash className="h-4 w-4" />
                    Limpiar todos los productos
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
