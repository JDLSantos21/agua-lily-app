export interface Printer {
  name: string;
  type: "thermal" | "label";
  isConnected: boolean;
  isDefault?: boolean;
}

export interface PrinterConfig {
  thermalPrinter: string | null;
  labelPrinter: string | null;
}

export interface PrinterResponse {
  success: boolean;
  printer?: string;
  error?: string;
}

export type PrinterType = "thermal" | "label";
