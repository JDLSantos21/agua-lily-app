import { z } from "zod";

export const outputSchema = z.object({
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
