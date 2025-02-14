import { AdjustmentCreate } from "@/types/materials/adjustment";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { newMaterial } from "@/types/materials/material";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const setStockStatus = (stock: number, minimumStock: number) => {
  if (stock <= minimumStock) {
    return "bg-red-500 animate-pulse";
  } else if (stock <= minimumStock * 2) {
    return "bg-yellow-500";
  } else {
    return "bg-blue-500";
  }
};

interface outputFormDataType {
  material_id: number;
  quantity: number;
  reason?: string;
  user_id?: number;
}

// Función mejorada de verificación
export const verifyEmployeeCode = async (code: string): Promise<boolean> => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/employees/validate-code`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error en la validación del código");
    }

    return (await response.json()).isValid;
  } catch (error) {
    console.log(error);
    throw new Error(
      "Ocurrió un problema validando el código, intenta de nuevo."
    );
  }
};

// Función mejorada de registro
export const setOutputMaterial = async (outputFormData: outputFormDataType) => {
  try {
    const response = await fetch(`http://localhost:5000/api/materials/output`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...outputFormData,
        reason: outputFormData.reason || "Salida General",
        type: "salida",
        user_id: outputFormData.user_id || 1,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error en el registro de salida");
    }

    return await response.json();
  } catch (error) {
    console.log(error);
    throw new Error(
      "Ocurrío un problema registrando la salida, intenta de nuevo."
    );
  }
};

//Funcion para registrar un ajuste
export const setAdjustment = async (adjustmentData: AdjustmentCreate) => {
  console.log("los adjustments", adjustmentData);
  try {
    const response = await fetch(
      `http://localhost:5000/api/materials/adjustment`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adjustmentData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error en el registro del ajuste");
    }

    return await response.json();
  } catch (error) {
    console.log(error);
    throw new Error(
      "Ocurrío un problema registrando el ajuste, intenta de nuevo."
    );
  }
};

//Funcion para registrar un nuevo material
export const setMaterial = async (materialData: newMaterial) => {
  try {
    const response = await fetch(`http://localhost:5000/api/materials`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(materialData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error en el registro del material");
    }

    return await response.json();
  } catch (error) {
    console.log(error);
    throw new Error(
      "Ocurrío un problema registrando el material, intenta de nuevo."
    );
  }
};

export const editMaterial = async (
  id: number,
  materialData: {
    name: string;
    category: string;
    description?: string;
    unit: string;
    price: number;
    minimum_stock: number;
  }
) => {
  try {
    const response = await fetch(`http://localhost:5000/api/materials/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(materialData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error en la edición del material");
    }

    return await response.json();
  } catch (error) {
    console.log(error);
    throw new Error(
      "Ocurrío un problema editando el material, intenta de nuevo."
    );
  }
};
