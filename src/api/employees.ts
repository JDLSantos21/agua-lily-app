import { fetcher } from "./fetcher";

export const verifyEmployeeCode = async (code: string): Promise<boolean> => {
  try {
    const response = await fetcher("/employees/validate-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    return (await response).isValid;
  } catch (error) {
    console.log(error);
    throw new Error(
      "Ocurrió un problema validando el código, intenta de nuevo."
    );
  }
};

export const getAllEmployees = async (role?: string): Promise<any> => {
  try {
    return await fetcher(
      "/employees",
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
      role ? { role } : {}
    );
  } catch (error) {
    console.log(error);
    throw new Error("Ocurrió un problema obteniendo los empleados.");
  }
};
