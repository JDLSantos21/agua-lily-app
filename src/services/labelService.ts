// services/labelService.ts
import axios from "axios";
import { API_URL } from "@/api/config";
import { getCookies } from "@/utils/authCookies";

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

class LabelService {
  private getAuthHeader() {
    // Get token from localStorage or another source
    const token = typeof window !== "undefined" ? getCookies().token : null;
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  async getSessionInfo(): Promise<SessionInfo> {
    const response = await axios.get<ApiResponse<SessionInfo>>(
      `${API_URL}/labels/session`,
      this.getAuthHeader()
    );
    return response.data.data as SessionInfo;
  }

  async generateLabels(
    quantity: number,
    description?: string,
    product_id?: number
  ): Promise<Label[]> {
    const response = await axios.post<ApiResponse<Label[]>>(
      `${API_URL}/labels/generate`,
      { quantity, description, product_id },
      this.getAuthHeader()
    );
    return response.data.data as Label[];
  }

  async getTodayLabels(): Promise<Label[]> {
    const response = await axios.get<ApiResponse<Label[]>>(
      `${API_URL}/labels/today`,
      this.getAuthHeader()
    );
    return response.data.data as Label[];
  }

  async getLabelsByDate(date: string): Promise<Label[]> {
    const response = await axios.get<ApiResponse<Label[]>>(
      `${API_URL}/labels/date/${date}`,
      this.getAuthHeader()
    );
    return response.data.data as Label[];
  }

  async getFilteredLabels(filters: {
    date?: string;
    status?: string;
    product_id?: number;
  }): Promise<Label[]> {
    const params = new URLSearchParams();

    if (filters.date) params.append("date", filters.date);
    if (filters.status) params.append("status", filters.status);
    if (filters.product_id)
      params.append("product_id", filters.product_id.toString());

    const response = await axios.get<ApiResponse<Label[]>>(
      `${API_URL}/labels/filter?${params.toString()}`,
      this.getAuthHeader()
    );
    return response.data.data as Label[];
  }

  async updateLabelStatus(id: number, status: string): Promise<void> {
    await axios.patch(
      `${API_URL}/labels/${id}/status`,
      { status },
      this.getAuthHeader()
    );
  }

  async printLabel(labelId: number, printerName?: string): Promise<void> {
    await axios.post(
      `${API_URL}/labels/print`,
      { label_id: labelId, printer_name: printerName },
      this.getAuthHeader()
    );
  }

  async getLabelById(id: number): Promise<Label> {
    const response = await axios.get<ApiResponse<Label>>(
      `${API_URL}/labels/${id}`,
      this.getAuthHeader()
    );
    return response.data.data as Label;
  }

  async getLabelPrintHistory(id: number): Promise<any[]> {
    const response = await axios.get<ApiResponse<any[]>>(
      `${API_URL}/labels/${id}/print-history`,
      this.getAuthHeader()
    );
    return response.data.data as any[];
  }

  async endDaySession(): Promise<SessionCloseResponse> {
    const response = await axios.post<ApiResponse<SessionCloseResponse>>(
      `${API_URL}/labels/session/end`,
      {},
      this.getAuthHeader()
    );
    return response.data.data as SessionCloseResponse;
  }

  async getLabelStats(startDate: string, endDate: string): Promise<any[]> {
    const response = await axios.get<ApiResponse<any[]>>(
      `${API_URL}/labels/stats?start_date=${startDate}&end_date=${endDate}`,
      this.getAuthHeader()
    );
    return response.data.data as any[];
  }

  async reopenDaySession(date: string): Promise<any> {
    const response = await axios.post<ApiResponse<any>>(
      `${API_URL}/labels/session/${date}/reopen`,
      {},
      this.getAuthHeader()
    );
    return response.data;
  }
}

export const labelService = new LabelService();
