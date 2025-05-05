// services/labelService.ts
import axios from "axios";
import { API_URL } from "@/api/config";
import { getCookies } from "@/utils/authCookies";

export interface Label {
  id: number;
  sequence_number: string;
  description?: string;
  quantity: number;
  date: string;
  created_at: string;
  status: string;
  user_name: string;
}

export interface SessionInfo {
  date: string;
  total_labels: number;
  current_counter: number;
  is_active: boolean;
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
    const response = await axios.get(
      `${API_URL}/labels/session`,
      this.getAuthHeader()
    );
    return response.data;
  }

  async generateLabels(
    quantity: number,
    user_id: number,
    description?: string
  ): Promise<Label[]> {
    const response = await axios.post(
      `${API_URL}/labels/generate`,
      { quantity, user_id, description },
      this.getAuthHeader()
    );
    return response.data.labels;
  }

  async getTodayLabels(): Promise<Label[]> {
    const response = await axios.get(
      `${API_URL}/labels/today`,
      this.getAuthHeader()
    );
    return response.data;
  }

  async getLabelsByDate(date: string): Promise<Label[]> {
    const response = await axios.get(
      `${API_URL}/labels/date/${date}`,
      this.getAuthHeader()
    );
    return response.data;
  }

  async updateLabelStatus(id: number, status: string): Promise<void> {
    await axios.patch(
      `${API_URL}/labels/${id}/status`,
      { status },
      this.getAuthHeader()
    );
  }

  async endDaySession(): Promise<{
    message: string;
    session_summary: SessionInfo;
  }> {
    const response = await axios.post(
      `${API_URL}/labels/session/end`,
      {},
      this.getAuthHeader()
    );
    return response.data;
  }
}

export const labelService = new LabelService();
