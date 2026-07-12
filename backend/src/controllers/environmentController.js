import asyncHandler from "../utils/asyncHandler.js";
import {
  paginationSchema,
  idParamSchema,
  emissionCategoryCreateSchema,
  emissionCategoryUpdateSchema,
  emissionFactorCreateSchema,
  emissionFactorUpdateSchema,
  carbonEmissionCreateSchema,
  carbonEmissionUpdateSchema,
  environmentalGoalCreateSchema,
  environmentalGoalUpdateSchema,
  wasteRecordCreateSchema,
  wasteRecordUpdateSchema,
  energyConsumptionCreateSchema,
  energyConsumptionUpdateSchema,
} from "../validations/environmentValidation.js";
import { environmentService } from "../services/environmentService.js";

const createController = (entityKey, createSchema, updateSchema, label) => ({
  list: asyncHandler(async (req, res) => {
    const query = paginationSchema.parse(req.query);
    const result = await environmentService.listEntities(entityKey, query);

    res.status(200).json({
      success: true,
      message: `${label} list fetched successfully`,
      ...result,
    });
  }),

  getById: asyncHandler(async (req, res) => {
    const { id } = idParamSchema.parse(req.params);
    const record = await environmentService.getEntityById(entityKey, id);

    res.status(200).json({
      success: true,
      message: `${label} fetched successfully`,
      data: record,
    });
  }),

  create: asyncHandler(async (req, res) => {
    const payload = createSchema.parse(req.body);
    const record = await environmentService.createEntity(entityKey, payload);

    res.status(201).json({
      success: true,
      message: `${label} created successfully`,
      data: record,
    });
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = idParamSchema.parse(req.params);
    const payload = updateSchema.parse(req.body);
    const record = await environmentService.updateEntity(entityKey, id, payload);

    res.status(200).json({
      success: true,
      message: `${label} updated successfully`,
      data: record,
    });
  }),

  remove: asyncHandler(async (req, res) => {
    const { id } = idParamSchema.parse(req.params);
    await environmentService.deleteEntity(entityKey, id);

    res.status(200).json({
      success: true,
      message: `${label} deleted successfully`,
    });
  }),
});

const emissionCategoryController = createController(
  "emissionCategories",
  emissionCategoryCreateSchema,
  emissionCategoryUpdateSchema,
  "Emission category"
);

const emissionFactorController = createController(
  "emissionFactors",
  emissionFactorCreateSchema,
  emissionFactorUpdateSchema,
  "Emission factor"
);

const carbonEmissionController = createController(
  "carbonEmissions",
  carbonEmissionCreateSchema,
  carbonEmissionUpdateSchema,
  "Carbon emission"
);

const environmentalGoalController = createController(
  "environmentalGoals",
  environmentalGoalCreateSchema,
  environmentalGoalUpdateSchema,
  "Environmental goal"
);

const wasteRecordController = createController(
  "wasteRecords",
  wasteRecordCreateSchema,
  wasteRecordUpdateSchema,
  "Waste record"
);

const energyConsumptionController = createController(
  "energyConsumptions",
  energyConsumptionCreateSchema,
  energyConsumptionUpdateSchema,
  "Energy consumption"
);

export {
  emissionCategoryController,
  emissionFactorController,
  carbonEmissionController,
  environmentalGoalController,
  wasteRecordController,
  energyConsumptionController,
};