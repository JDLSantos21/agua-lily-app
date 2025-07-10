import { api } from "@/services/api";

export const verifyEmployeeCode = async (code: string): Promise<boolean> => {
  try {
    const res = await api.post("/employees/validate-code", { code });
    return res.data.isValid;
  } catch (error) {
    console.log("Error verifying employee code:", error);
    throw new Error("Ocurrió un problema verificando el código del empleado.");
  }
};

export const getAllEmployees = async (role?: string): Promise<any> => {
  const res = await api.get("/employees", { params: role ? { role } : {} });
  return res.data;
};
