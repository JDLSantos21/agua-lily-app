export interface Label {
  id: number;
  sequence_number: string;
  description?: string;
  product_id?: number;
  quantity: number;
  date: string;
  created_at: string;
  status: string;
  user_name: string;
  printed_at?: string;
}

export interface SessionInfo {
  date: string;
  total_labels: number;
  total_bottles: number;
  current_counter: number;
  is_active: boolean;
  is_closed: boolean;
  created_at?: string;
  closed_at?: string;
  created_by?: number;
  closed_by?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface SessionCloseResponse {
  message: string;
  data: {
    session_summary: SessionInfo;
    closed_at: string;
    closed_by: number;
  };
}

export interface LabelPrintRequest {
  label_id: number;
  printer_name?: string;
}
