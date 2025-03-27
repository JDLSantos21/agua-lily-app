export interface setMovement {
  material_id: number;
  quantity: number;
  reason?: string;
  employee_code: string;
  user_id: number;
  type: string;
}

export interface adjustmentFilter {
  material_name?: string;
  start_date?: Date | string;
  end_date?: Date | string;
}

export interface CreateAdjustment {
  material_id: number;
  quantity: number;
  reason: string;
  employee_code: string;
  user_id: number;
}

export interface InventoryMovement {
  id: number;
  material_name: string;
  quantity: string; // Aunque es un string en la API, podrías convertirlo a number si lo prefieres
  type: string;
  reason: string;
  employee: string;
  employee_code: string;
  user: string;
  user_id: number;
  created_at: string; // Puedes usar Date si lo conviertes al procesar los datos
}
