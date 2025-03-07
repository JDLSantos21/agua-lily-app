import { z } from "zod";

const outputSchema = z.object({
  employee_code: z.string().min(1, "El código de empleado es obligatorio."),
  quantity: z
    .number()
    .positive("La cantidad debe ser un número positivo")
    .min(1, "Debe ingresar al menos una unidad"),
  reason_checkbox: z.boolean().optional(),
  reason: z.string().optional(),
});

export const validateOutput = async (object: unknown) => {
  return outputSchema.safeParse(object);
};

const AdjustmentCreateSchema = z.object({
  material_id: z.number().int().positive(),
  quantity: z.number().int().positive(),
  reason: z.string().max(255),
  employee_code: z.string().min(1),
  user_id: z.number().int().positive(),
});

export const validateAdjustment = async (object: unknown) => {
  return AdjustmentCreateSchema.safeParse(object);
};
