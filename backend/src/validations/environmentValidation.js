import { z } from "zod";

const positiveDecimal = z.coerce.number().finite();
const positiveInteger = z.coerce.number().int().positive();
const optionalId = z.coerce.number().int().positive().optional();

const baseText = z.string().trim().min(1);

const updateObject = (schema) =>
  schema.partial().refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

export const idParamSchema = z.object({
  id: positiveInteger,
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const emissionCategoryCreateSchema = z.object({
  name: baseText,
  code: baseText,
  description: z.string().trim().optional(),
  isActive: z.coerce.boolean().optional().default(true),
  departmentId: positiveInteger,
  createdById: optionalId,
});

export const emissionCategoryUpdateSchema = updateObject(emissionCategoryCreateSchema);

export const emissionFactorCreateSchema = z.object({
  name: baseText,
  code: baseText,
  description: z.string().trim().optional(),
  activityType: baseText,
  unit: baseText,
  factorValue: positiveDecimal,
  factorUnit: baseText,
  source: z.string().trim().optional(),
  isActive: z.coerce.boolean().optional().default(true),
  emissionCategoryId: positiveInteger,
  departmentId: positiveInteger,
  createdById: optionalId,
});

export const emissionFactorUpdateSchema = updateObject(emissionFactorCreateSchema);

export const carbonEmissionCreateSchema = z.object({
  title: baseText,
  activityName: baseText,
  activityValue: positiveDecimal,
  activityUnit: baseText,
  emissionAmount: positiveDecimal,
  scope: z.string().trim().optional(),
  emissionDate: z.coerce.date(),
  notes: z.string().trim().optional(),
  source: z.string().trim().optional(),
  emissionCategoryId: positiveInteger,
  emissionFactorId: positiveInteger.optional(),
  departmentId: positiveInteger,
  createdById: optionalId,
});

export const carbonEmissionUpdateSchema = updateObject(carbonEmissionCreateSchema);

export const environmentalGoalCreateSchema = z.object({
  title: baseText,
  description: z.string().trim().optional(),
  goalType: z.string().trim().optional(),
  targetValue: positiveDecimal,
  currentValue: positiveDecimal.optional().default(0),
  baselineValue: positiveDecimal.optional(),
  unit: baseText,
  status: z.string().trim().optional().default("ACTIVE"),
  startDate: z.coerce.date().optional(),
  targetDate: z.coerce.date(),
  achievedAt: z.coerce.date().optional(),
  departmentId: positiveInteger,
  createdById: optionalId,
});

export const environmentalGoalUpdateSchema = updateObject(environmentalGoalCreateSchema);

export const wasteRecordCreateSchema = z.object({
  wasteType: baseText,
  quantity: positiveDecimal,
  unit: baseText,
  disposalMethod: baseText,
  hazardous: z.coerce.boolean().optional().default(false),
  recycled: z.coerce.boolean().optional().default(false),
  recordDate: z.coerce.date().optional().default(() => new Date()),
  notes: z.string().trim().optional(),
  departmentId: positiveInteger,
  createdById: optionalId,
});

export const wasteRecordUpdateSchema = updateObject(wasteRecordCreateSchema);

export const energyConsumptionCreateSchema = z.object({
  sourceType: baseText,
  consumption: positiveDecimal,
  unit: baseText,
  periodStart: z.coerce.date(),
  periodEnd: z.coerce.date(),
  cost: positiveDecimal.optional(),
  carbonEmission: positiveDecimal.optional(),
  notes: z.string().trim().optional(),
  departmentId: positiveInteger,
  createdById: optionalId,
});

export const energyConsumptionUpdateSchema = updateObject(energyConsumptionCreateSchema);