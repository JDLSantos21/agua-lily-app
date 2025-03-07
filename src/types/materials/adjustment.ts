export interface Adjustment {
  id: number;
  material_id: number;
  type: string;
  quantity: string;
  reason: string;
  employee_code: string;
  user_id: number;
  previous_stock: number;
  new_stock: number;
  created_at: string;
  updated_at: string;
  user_name: string;
  employee_name: string;
  material_name: string;
}

export interface CreateAdjustment {
  material_id: number;
  quantity: number;
  reason: string;
  employee_code: string;
  user_id: number;
}
