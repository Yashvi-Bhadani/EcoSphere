import { matchedData } from "express-validator";
import asyncHandler from "../utils/asyncHandler.js";
import { environmentService } from "../services/environmentService.js";

const sendSuccess = (res, message, data = null, meta = null, statusCode = 200) =>
  res.status(statusCode).json({
    success: true,
    message,
    ...(data !== null ? { data } : {}),
    ...(meta !== null ? { meta } : {}),
  });

export const carbonEmissionController = {
  list: asyncHandler(async (req, res) => {
    const query = matchedData(req, { locations: ["query"] });
    const result = await environmentService.listCarbonEmissions(query);

    return sendSuccess(res, "Carbon emission records fetched successfully", result.items, result.meta);
  }),

  getById: asyncHandler(async (req, res) => {
    const { id } = matchedData(req, { locations: ["params"] });
    const record = await environmentService.getCarbonEmissionById(id);

    return sendSuccess(res, "Carbon emission record fetched successfully", record);
  }),

  create: asyncHandler(async (req, res) => {
    const payload = matchedData(req, { locations: ["body"] });
    const record = await environmentService.createCarbonEmission(payload);

    return sendSuccess(res, "Carbon emission record created successfully", record, null, 201);
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = matchedData(req, { locations: ["params"] });
    const payload = matchedData(req, { locations: ["body"] });
    const record = await environmentService.updateCarbonEmission(id, payload);

    return sendSuccess(res, "Carbon emission record updated successfully", record);
  }),

  remove: asyncHandler(async (req, res) => {
    const { id } = matchedData(req, { locations: ["params"] });
    await environmentService.deleteCarbonEmission(id);

    return sendSuccess(res, "Carbon emission record deleted successfully");
  }),

  report: asyncHandler(async (req, res) => {
    const query = matchedData(req, { locations: ["query"] });
    const report = await environmentService.getCarbonEmissionReport(query);

    return sendSuccess(res, "Carbon emission report fetched successfully", report);
  }),
};

export const energyConsumptionController = {
  list: asyncHandler(async (req, res) => {
    const query = matchedData(req, { locations: ["query"] });
    const result = await environmentService.listEnergyConsumptions(query);

    return sendSuccess(res, "Energy consumption records fetched successfully", result.items, result.meta);
  }),

  getById: asyncHandler(async (req, res) => {
    const { id } = matchedData(req, { locations: ["params"] });
    const record = await environmentService.getEnergyConsumptionById(id);

    return sendSuccess(res, "Energy consumption record fetched successfully", record);
  }),

  create: asyncHandler(async (req, res) => {
    const payload = matchedData(req, { locations: ["body"] });
    const record = await environmentService.createEnergyConsumption(payload);

    return sendSuccess(res, "Energy consumption record created successfully", record, null, 201);
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = matchedData(req, { locations: ["params"] });
    const payload = matchedData(req, { locations: ["body"] });
    const record = await environmentService.updateEnergyConsumption(id, payload);

    return sendSuccess(res, "Energy consumption record updated successfully", record);
  }),

  remove: asyncHandler(async (req, res) => {
    const { id } = matchedData(req, { locations: ["params"] });
    await environmentService.deleteEnergyConsumption(id);

    return sendSuccess(res, "Energy consumption record deleted successfully");
  }),

  report: asyncHandler(async (req, res) => {
    const query = matchedData(req, { locations: ["query"] });
    const report = await environmentService.getEnergyConsumptionReport(query);

    return sendSuccess(res, "Energy consumption report fetched successfully", report);
  }),
};