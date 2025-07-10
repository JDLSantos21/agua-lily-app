// services/labelService.ts
import {
  ApiResponse,
  Label,
  SessionCloseResponse,
  SessionInfo,
} from "@/types/label.types";
import { api } from "./api";

class LabelService {
  async getSessionInfo(): Promise<SessionInfo> {
    const res = await api.get("/labels/session");
    return res.data.data as SessionInfo;
    // const response = await axios.get<ApiResponse<SessionInfo>>(
    //   `${API_URL}/labels/session`,
    //   this.getAuthHeader()
    // );
    // return response.data.data as SessionInfo;
  }

  async generateLabels(
    quantity: number,
    description?: string,
    product_id?: number
  ): Promise<Label[]> {
    const res = await api.post<ApiResponse<Label[]>>("/labels/generate", {
      quantity,
      description,
      product_id,
    });

    return res.data.data as Label[];

    // const response = await axios.post<ApiResponse<Label[]>>(
    //   `${API_URL}/labels/generate`,
    //   { quantity, description, product_id },
    //   this.getAuthHeader()
    // );
    // return response.data.data as Label[];
  }

  async getTodayLabels(): Promise<Label[]> {
    const res = await api.get<ApiResponse<Label[]>>("/labels/today");
    return res.data.data as Label[];

    // const response = await axios.get<ApiResponse<Label[]>>(
    //   `${API_URL}/labels/today`,
    //   this.getAuthHeader()
    // );
    // return response.data.data as Label[];
  }

  async getLabelsByDate(date: string): Promise<Label[]> {
    const res = await api.get<ApiResponse<Label[]>>(`/labels/date/${date}`);
    return res.data.data as Label[];
    // const response = await axios.get<ApiResponse<Label[]>>(
    //   `${API_URL}/labels/date/${date}`,
    //   this.getAuthHeader()
    // );
    // return response.data.data as Label[];
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

    const res = await api.get<ApiResponse<Label[]>>(
      `/labels/filter?${params.toString()}`
    );
    return res.data.data as Label[];

    // const response = await axios.get<ApiResponse<Label[]>>(
    //   `${API_URL}/labels/filter?${params.toString()}`,
    //   this.getAuthHeader()
    // );
    // return response.data.data as Label[];
  }

  async updateLabelStatus(id: number, status: string): Promise<void> {
    return api.patch(`/labels/${id}/status`, { status });

    // await axios.patch(
    //   `${API_URL}/labels/${id}/status`,
    //   { status },
    //   this.getAuthHeader()
    // );
  }

  async printLabel(labelId: number, printerName?: string): Promise<void> {
    return api.post(`/labels/print`, {
      label_id: labelId,
      printer_name: printerName,
    });
    // await axios.post(
    //   `${API_URL}/labels/print`,
    //   { label_id: labelId, printer_name: printerName },
    //   this.getAuthHeader()
    // );
  }

  async getLabelById(id: number): Promise<Label> {
    const res = await api.get<ApiResponse<Label>>(`/labels/${id}`);
    return res.data.data as Label;

    // const response = await axios.get<ApiResponse<Label>>(
    //   `${API_URL}/labels/${id}`,
    //   this.getAuthHeader()
    // );
    // return response.data.data as Label;
  }

  async getLabelPrintHistory(id: number): Promise<any[]> {
    const res = await api.get<ApiResponse<any[]>>(
      `/labels/${id}/print-history`
    );
    return res.data.data as any[];
    // const response = await axios.get<ApiResponse<any[]>>(
    //   `${API_URL}/labels/${id}/print-history`,
    //   this.getAuthHeader()
    // );
    // return response.data.data as any[];
  }

  async endDaySession(): Promise<SessionCloseResponse> {
    const res = await api.post<ApiResponse<SessionCloseResponse>>(
      "/labels/session/end",
      {}
    );
    return res.data.data as SessionCloseResponse;

    // const response = await axios.post<ApiResponse<SessionCloseResponse>>(
    //   `${API_URL}/labels/session/end`,
    //   {},
    //   this.getAuthHeader()
    // );
    // return response.data.data as SessionCloseResponse;
  }

  async getLabelStats(startDate: string, endDate: string): Promise<any[]> {
    const res = await api.get<ApiResponse<any[]>>(
      `/labels/stats?start_date=${startDate}&end_date=${endDate}`
    );
    return res.data.data as any[];
    // const response = await axios.get<ApiResponse<any[]>>(
    //   `${API_URL}/labels/stats?start_date=${startDate}&end_date=${endDate}`,
    //   this.getAuthHeader()
    // );
    // return response.data.data as any[];
  }

  async reopenDaySession(date: string): Promise<any> {
    const res = await api.post<ApiResponse<any>>(
      `/labels/session/${date}/reopen`,
      {}
    );
    return res.data.data;
    // const response = await axios.post<ApiResponse<any>>(
    //   `${API_URL}/labels/session/${date}/reopen`,
    //   {},
    //   this.getAuthHeader()
    // );
    // return response.data;
  }
}

export const labelService = new LabelService();
