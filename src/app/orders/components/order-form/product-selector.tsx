// src/app/orders/components/order-form/product-selector.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LoaderSpin } from "@/components/Loader";
import { Empty } from "@/components/Empty";
import { Product, OrderItem } from "@/types/orders.types";
import { Plus, Minus, X, Search, Trash } from "lucide-react";
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
    <div>
      <div className="flex flex-col">
        {/* Selector de productos */}
        <div>
          <Card className="border-none shadow-none">
            <CardHeader>
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
            </CardHeader>
            <CardContent className="flex justify-between gap-2">
              {/* Lista de productos */}
              <div className="h-64 overflow-y-auto border rounded-md w-[45%]">
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
                          px-3 py-1 cursor-pointer hover:bg-gray-50 transition
                          ${selectedProduct?.id === product.id ? "bg-primary/10" : ""}
                        `}
                        onClick={() => handleSelectProduct(product)}
                      >
                        <div className="flex justify-between items-center">
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
                <div className="border rounded-md relative p-3 h-64 flex justify-evenly flex-col w-[50%]">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{selectedProduct.name}</h3>
                      <p className="text-xs text-gray-500">
                        {selectedProduct.size && `${selectedProduct.size} `}
                        {selectedProduct.unit}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-6 w-6 p-0 text-white"
                      onClick={() => setSelectedProduct(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex justify-between items-start mt-1">
                    <div>
                      <div className="flex items-center mt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() =>
                            setQuantity((prev) => Math.max(1, (prev || 1) - 1))
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          id="quantity"
                          type="number"
                          value={quantity || ""}
                          onChange={(e) => setQuantity(Number(e.target.value))}
                          className="h-8 text-center mx-2 w-16 noControls"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => setQuantity((prev) => (prev || 0) + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <Label htmlFor="notes" className="text-xs">
                        Notas
                      </Label>
                      <Input
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Instrucciones o comentarios específicos"
                        className="mt-1 text-sm"
                      />
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    size="sm"
                    variant="primary"
                    onClick={handleAddProduct}
                  >
                    Añadir al Pedido
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Lista de productos seleccionados */}
        <div>
          <Card className="border-none shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-md flex items-center justify-between">
                <span className="flex items-center gap-1">
                  Productos seleccionados
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
                  <p>No hay productos añadidos al pedido</p>
                  <p className="text-xs mt-1">
                    Seleccione productos del panel superior
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
                          className="border rounded-md px-3 py-1 relative flex items-center justify-between"
                        >
                          <div className="flex w-2/5 justify-between items-start border-r-1 border-gray-400">
                            <div>
                              <div className="font-medium">
                                {item.product_name || productData?.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {productData?.size && `${productData.size} `}
                                {productData?.unit || item.unit}
                              </div>
                            </div>
                          </div>

                          {item.notes && (
                            <div className="text-xs rounded w-[32%]">
                              {item.notes}
                            </div>
                          )}

                          <div className="flex items-center w-[23%]">
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
                          <X
                            onClick={() => handleRemoveItem(index)}
                            className="h-5 w-5 text-red-500 hover:text-red-700 absolute right-3 cursor-pointer"
                          />
                        </li>
                      );
                    })}
                  </ul>

                  <Separator />

                  <div className="flex gap-2 items-center text-sm">
                    <span>Total de productos:</span>
                    <span className="font-medium">{selectedItems.length}</span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-red-500 hover:text-red-700 hover:bg-red-50 mt-2 gap-1"
                    onClick={() => onChange([])}
                  >
                    <Trash className="h-4 w-4" />
                    Quitar todos los productos
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
