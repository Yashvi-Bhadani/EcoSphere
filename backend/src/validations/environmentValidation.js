import { body, param, query, validationResult } from "express-validator";

const respondValidationErrors = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.array(),
    });
  }

  return next();
};

const optionalIntegerId = (field) => body(field).optional({ nullable: true, checkFalsy: true }).isInt({ gt: 0 }).toInt();

const requiredIntegerId = (field) => body(field).isInt({ gt: 0 }).toInt();

const requiredDecimal = (field) => body(field).isFloat().toFloat();

const optionalDecimal = (field) => body(field).optional({ nullable: true, checkFalsy: true }).isFloat().toFloat();

const requiredText = (field, min = 1) => body(field).isString().trim().isLength({ min });

const optionalText = (field) => body(field).optional({ nullable: true, checkFalsy: true }).isString().trim();

const parsePositiveIntQuery = (field, defaultValue, maxValue = 100) =>
  query(field).optional().isInt({ gt: 0, max: maxValue }).toInt().default(defaultValue);

const parseSortDirection = query("sortOrder").optional().isIn(["asc", "desc"]).toLowerCase().default("desc");

const buildListValidators = (allowedSortFields) => [
  query("page").optional().isInt({ gt: 0 }).toInt().default(1),
  query("limit").optional().isInt({ gt: 0, max: 100 }).toInt().default(20),
  query("search").optional().isString().trim(),
  query("departmentId").optional().isInt({ gt: 0 }).toInt(),
  query("createdById").optional().isInt({ gt: 0 }).toInt(),
  query("sortBy").optional().isIn(allowedSortFields).default("createdAt"),
  parseSortDirection,
  respondValidationErrors,
];

const carbonEmissionCreateValidators = [
  requiredText("title"),
  requiredText("activityName"),
  requiredDecimal("activityValue"),
  requiredText("activityUnit"),
  requiredDecimal("emissionAmount"),
  optionalText("scope"),
  body("emissionDate").isISO8601().toDate(),
  optionalText("notes"),
  optionalText("source"),
  requiredIntegerId("emissionCategoryId"),
  body("emissionFactorId").optional({ nullable: true, checkFalsy: true }).isInt({ gt: 0 }).toInt(),
  requiredIntegerId("departmentId"),
  optionalIntegerId("createdById"),
  respondValidationErrors,
];

const carbonEmissionUpdateValidators = [
  body().custom((value) => typeof value === "object" && value !== null && Object.keys(value).length > 0),
  body("title").optional().isString().trim().isLength({ min: 1 }),
  body("activityName").optional().isString().trim().isLength({ min: 1 }),
  body("activityValue").optional().isFloat().toFloat(),
  body("activityUnit").optional().isString().trim().isLength({ min: 1 }),
  body("emissionAmount").optional().isFloat().toFloat(),
  optionalText("scope"),
  body("emissionDate").optional().isISO8601().toDate(),
  optionalText("notes"),
  optionalText("source"),
  body("emissionCategoryId").optional().isInt({ gt: 0 }).toInt(),
  body("emissionFactorId").optional({ nullable: true, checkFalsy: true }).isInt({ gt: 0 }).toInt(),
  body("departmentId").optional().isInt({ gt: 0 }).toInt(),
  optionalIntegerId("createdById"),
  respondValidationErrors,
];

const energyConsumptionCreateValidators = [
  requiredText("sourceType"),
  requiredDecimal("consumption"),
  requiredText("unit"),
  body("periodStart").isISO8601().toDate(),
  body("periodEnd").isISO8601().toDate(),
  optionalDecimal("cost"),
  optionalDecimal("carbonEmission"),
  optionalText("notes"),
  requiredIntegerId("departmentId"),
  optionalIntegerId("createdById"),
  body("periodEnd").custom((value, { req }) => {
    if (req.body.periodStart && new Date(value) < new Date(req.body.periodStart)) {
      throw new Error("periodEnd must be greater than or equal to periodStart");
    }

    return true;
  }),
  respondValidationErrors,
];

const energyConsumptionUpdateValidators = [
  body().custom((value) => typeof value === "object" && value !== null && Object.keys(value).length > 0),
  body("sourceType").optional().isString().trim().isLength({ min: 1 }),
  body("consumption").optional().isFloat().toFloat(),
  body("unit").optional().isString().trim().isLength({ min: 1 }),
  body("periodStart").optional().isISO8601().toDate(),
  body("periodEnd").optional().isISO8601().toDate(),
  optionalDecimal("cost"),
  optionalDecimal("carbonEmission"),
  optionalText("notes"),
  body("departmentId").optional().isInt({ gt: 0 }).toInt(),
  optionalIntegerId("createdById"),
  body("periodEnd").optional().custom((value, { req }) => {
    if (req.body.periodStart && new Date(value) < new Date(req.body.periodStart)) {
      throw new Error("periodEnd must be greater than or equal to periodStart");
    }

    return true;
  }),
  respondValidationErrors,
];

export const idParamValidators = [param("id").isInt({ gt: 0 }).toInt(), respondValidationErrors];

export const carbonEmissionListValidators = buildListValidators([
  "id",
  "title",
  "activityName",
  "scope",
  "emissionDate",
  "createdAt",
  "departmentId",
  "createdById",
  "emissionCategoryId",
  "emissionFactorId",
  "emissionAmount",
]);

export const carbonEmissionCreateValidation = carbonEmissionCreateValidators;
export const carbonEmissionUpdateValidation = carbonEmissionUpdateValidators;

export const carbonEmissionReportValidators = [
  query("departmentId").optional().isInt({ gt: 0 }).toInt(),
  query("from").optional().isISO8601().toDate(),
  query("to").optional().isISO8601().toDate(),
  respondValidationErrors,
];

export const energyConsumptionListValidators = buildListValidators([
  "id",
  "sourceType",
  "unit",
  "periodStart",
  "periodEnd",
  "createdAt",
  "departmentId",
  "createdById",
  "consumption",
  "cost",
  "carbonEmission",
]);

export const energyConsumptionCreateValidation = energyConsumptionCreateValidators;
export const energyConsumptionUpdateValidation = energyConsumptionUpdateValidators;

export const energyConsumptionReportValidators = [
  query("departmentId").optional().isInt({ gt: 0 }).toInt(),
  query("from").optional().isISO8601().toDate(),
  query("to").optional().isISO8601().toDate(),
  respondValidationErrors,
];