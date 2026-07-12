import asyncHandler from "../utils/asyncHandler.js";
import { environmentService } from "../services/environmentService.js";
import {
  idParamSchema,
  queryFilterSchema,
  carbonEmissionCreateSchema,
  carbonEmissionUpdateSchema,
  energyConsumptionCreateSchema,
  energyConsumptionUpdateSchema,
  wasteRecordCreateSchema,
  wasteRecordUpdateSchema,
  environmentalGoalCreateSchema,
  environmentalGoalUpdateSchema,
  environmentalGoalProgressSchema,
} from "../validations/environmentValidation.js";

const sendSuccess = (res, message, data = null, meta = null, statusCode = 200) =>
  res.status(statusCode).json({
    success: true,
    message,
    ...(data !== null ? { data } : {}),
    ...(meta !== null ? { meta } : {}),
  });

const createCrudController = (entityKey, label, createSchema, updateSchema) => ({
  list: asyncHandler(async (req, res) => {
    const query = queryFilterSchema.parse(req.query);
    const result = await environmentService.listEntities(entityKey, query);

    return sendSuccess(res, `${label} list fetched successfully`, result.items, result.meta);
  }),

  getById: asyncHandler(async (req, res) => {
    const { id } = idParamSchema.parse(req.params);
    const record = await environmentService.getEntityById(entityKey, id);

    return sendSuccess(res, `${label} fetched successfully`, record);
  }),

  create: asyncHandler(async (req, res) => {
    const payload = createSchema.parse(req.body);
    const record = await environmentService.createEntity(entityKey, payload);

    return sendSuccess(res, `${label} created successfully`, record, null, 201);
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = idParamSchema.parse(req.params);
    const payload = updateSchema.parse(req.body);
    const record = await environmentService.updateEntity(entityKey, id, payload);

    return sendSuccess(res, `${label} updated successfully`, record);
  }),

  remove: asyncHandler(async (req, res) => {
    const { id } = idParamSchema.parse(req.params);
    await environmentService.deleteEntity(entityKey, id);

    return sendSuccess(res, `${label} deleted successfully`);
  }),
});

export const carbonEmissionController = createCrudController(
  "carbonEmissions",
  "Carbon emission",
  carbonEmissionCreateSchema,
  carbonEmissionUpdateSchema
);

export const energyConsumptionController = createCrudController(
  "energyConsumptions",
  "Energy consumption",
  energyConsumptionCreateSchema,
  energyConsumptionUpdateSchema
);

export const wasteRecordController = createCrudController(
  "wasteRecords",
  "Waste record",
  wasteRecordCreateSchema,
  wasteRecordUpdateSchema
);

export const environmentalGoalController = {
  ...createCrudController(
    "environmentalGoals",
    "Environmental goal",
    environmentalGoalCreateSchema,
    environmentalGoalUpdateSchema
  ),

  progress: asyncHandler(async (req, res) => {
    const { id } = idParamSchema.parse(req.params);
    const payload = environmentalGoalProgressSchema.parse(req.body);
    const record = await environmentService.updateGoalProgress(id, payload);

    return sendSuccess(res, "Environmental goal progress updated successfully", record);
  }),
};
