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
