export interface newMaterial {
  name: string;
  description: string;
  category: string;
  unit: string;
  price: number;
  stock: number;
  minimum_stock: number;
}

export interface UpdatedMaterial {
  name: string;
  category: string;
  description?: string;
  unit: string;
  price: number;
  minimum_stock: number;
}

export interface outputFormDataType {
  material_id: number;
  quantity: number;
  reason?: string;
  user_id?: number;
}
