export type Material = {
  id: number;
  name: string;
  category: string;
  description?: string;
  unit: string;
  price: number;
  stock?: number;
  minimum_stock: number;
  created_at?: string;
  updated_at?: string;
};

export type MaterialsArray = Material[];
