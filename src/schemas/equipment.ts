import { z } from "zod";

export const createEquipmentSchema = z.object({
  model_id: z.number().int().positive({
    message: "Debe seleccionar un modelo de equipo",
  }),
  current_customer_id: z
    .number()
    .int()
    .positive()
    .optional()
    .nullable()
    .default(null),
  status: z
    .enum(["disponible", "asignado", "mantenimiento", "inhabilitado"], {
      errorMap: () => ({
        message:
          "Estado debe ser 'disponible', 'asignado', 'mantenimiento' o 'inhabilitado'",
      }),
    })
    .default("disponible"),
  notes: z.string().optional(),
});

export type CreateEquipmentFormData = z.infer<typeof createEquipmentSchema>;

// Schema para asignar equipo a cliente
export const equipmentAssignmentSchema = z.object({
  equipment_id: z.number().int().positive({
    message: "Debe seleccionar un equipo",
  }),
  customer_id: z.number().int().positive({
    message: "Debe seleccionar un cliente",
  }),
  notes: z.string().optional(),
  weekly_commitment: z
    .number()
    .int()
    .min(0, { message: "El compromiso semanal debe ser un número positivo" })
    .max(7, { message: "El compromiso semanal no puede ser mayor a 7 días" })
    .optional()
    .nullable(),
});

export type EquipmentAssignmentFormData = z.infer<
  typeof equipmentAssignmentSchema
>;

// Schema para remover equipo de cliente
export const equipmentRemovalSchema = z.object({
  removal_reason: z
    .string()
    .min(3, { message: "Debe proporcionar una razón para remover el equipo" })
    .max(500, { message: "La razón no puede exceder 500 caracteres" }),
});

export type EquipmentRemovalFormData = z.infer<typeof equipmentRemovalSchema>;

// Schema para crear nuevo modelo de equipo
export const createEquipmentModelSchema = z.object({
  description: z
    .string()
    .min(1, "La descripción es requerida")
    .max(100, "La descripción no puede exceder 100 caracteres"),
  brand: z
    .string()
    .min(1, "La marca es requerida")
    .max(50, "La marca no puede exceder 50 caracteres"),
  type: z.enum(["nevera", "anaquel", "otro"], {
    errorMap: () => ({ message: "Tipo debe ser 'nevera', 'anaquel' o 'otro'" }),
  }),
  capacity: z.number().positive("La capacidad debe ser un número positivo"),
  capacity_unit: z.string().min(1, "La unidad de capacidad es requerida"),
});

export type CreateEquipmentModelFormData = z.infer<
  typeof createEquipmentModelSchema
>;
