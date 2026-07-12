import { z } from "zod";

const idValue = z.string().trim().min(1);
const decimalValue = z.coerce.number().finite();
const baseText = z.string().trim().min(1);

const updateObject = (schema) =>
  schema.partial().refine((value) => Object.keys(value).length > 0, {
    message: "At least one field must be provided",
  });

export const idParamSchema = z.object({
  id: idValue,
});

export const queryFilterSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  status: z.string().trim().optional(),
  departmentId: idValue.optional(),
  createdById: idValue.optional(),
  emissionCategoryId: idValue.optional(),
  emissionFactorId: idValue.optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  sortBy: z.string().trim().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  scope: z.string().trim().optional(),
  sourceType: z.string().trim().optional(),
  goalType: z.string().trim().optional(),
  hazardous: z.coerce.boolean().optional(),
  recycled: z.coerce.boolean().optional(),
});

export const emissionCategoryCreateSchema = z.object({
  name: baseText,
  code: baseText,
  description: z.string().trim().optional(),
  departmentId: idValue,
  createdById: idValue.optional(),
});

export const emissionCategoryUpdateSchema = updateObject(emissionCategoryCreateSchema);

export const emissionFactorCreateSchema = z.object({
  name: baseText,
  code: baseText,
  description: z.string().trim().optional(),
  activityType: baseText,
  unit: baseText,
  factorValue: decimalValue,
  factorUnit: baseText,
  source: z.string().trim().optional(),
  emissionCategoryId: idValue,
  departmentId: idValue,
  createdById: idValue.optional(),
});

export const emissionFactorUpdateSchema = updateObject(emissionFactorCreateSchema);

export const carbonEmissionCreateSchema = z.object({
  title: baseText,
  activityName: baseText,
  activityValue: decimalValue,
  activityUnit: baseText,
  emissionAmount: decimalValue,
  scope: z.string().trim().optional(),
  emissionDate: z.coerce.date(),
  notes: z.string().trim().optional(),
  source: z.string().trim().optional(),
  emissionCategoryId: idValue,
  emissionFactorId: idValue.optional(),
  departmentId: idValue,
  createdById: idValue.optional(),
});

export const carbonEmissionUpdateSchema = updateObject(carbonEmissionCreateSchema);

export const energyConsumptionCreateSchema = z.object({
  sourceType: baseText,
  consumption: decimalValue,
  unit: baseText,
  periodStart: z.coerce.date(),
  periodEnd: z.coerce.date(),
  cost: decimalValue.optional(),
  carbonEmission: decimalValue.optional(),
  notes: z.string().trim().optional(),
  departmentId: idValue,
  createdById: idValue.optional(),
});

export const energyConsumptionUpdateSchema = updateObject(energyConsumptionCreateSchema);

export const wasteRecordCreateSchema = z.object({
  wasteType: baseText,
  quantity: decimalValue,
  unit: baseText,
  disposalMethod: baseText,
  hazardous: z.coerce.boolean().optional().default(false),
  recycled: z.coerce.boolean().optional().default(false),
  recordDate: z.coerce.date().optional().default(() => new Date()),
  notes: z.string().trim().optional(),
  departmentId: idValue,
  createdById: idValue.optional(),
});

export const wasteRecordUpdateSchema = updateObject(wasteRecordCreateSchema);

export const environmentalGoalCreateSchema = z.object({
  title: baseText,
  description: z.string().trim().optional(),
  goalType: z.string().trim().optional(),
  targetValue: decimalValue,
  currentValue: decimalValue.optional().default(0),
  baselineValue: decimalValue.optional(),
  unit: baseText,
  status: z.string().trim().optional().default("ACTIVE"),
  startDate: z.coerce.date().optional(),
  targetDate: z.coerce.date(),
  achievedAt: z.coerce.date().optional(),
  departmentId: idValue,
  createdById: idValue.optional(),
});

export const environmentalGoalUpdateSchema = updateObject(environmentalGoalCreateSchema);

export const environmentalGoalProgressSchema = z.object({
  currentValue: decimalValue,
  status: z.string().trim().optional(),
});
