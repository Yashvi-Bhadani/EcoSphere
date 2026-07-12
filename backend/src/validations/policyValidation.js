import { body, param, validationResult } from "express-validator";
import ApiError from "../utils/apiError.js";

const policyValidationRules = () => [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 120 })
    .withMessage("Title must be between 3 and 120 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10, max: 5000 })
    .withMessage("Description must be between 10 and 5000 characters"),
  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isIn(["Environmental", "Social", "Governance", "Ethics", "Compliance"])
    .withMessage("Category must be one of: Environmental, Social, Governance, Ethics, Compliance"),
  body("version")
    .trim()
    .notEmpty()
    .withMessage("Version is required")
    .matches(/^v?\d+(\.\d+){0,2}$/)
    .withMessage("Version must be in format v1, v1.2, or v1.2.3"),
  body("effectiveDate")
    .optional({ nullable: true })
    .isISO8601()
    .withMessage("Effective date must be a valid date"),
  body("status")
    .optional()
    .isIn(["DRAFT", "ACTIVE", "ARCHIVED"])
    .withMessage("Status must be one of: DRAFT, ACTIVE, ARCHIVED"),
];

export const createPolicyValidation = policyValidationRules();
export const updatePolicyValidation = [
  param("id").isInt({ min: 1 }).withMessage("Policy id must be a positive integer"),
  ...policyValidationRules().map((rule) => rule.optional({ nullable: true })),
];

export const policyIdValidation = [
  param("id").isInt({ min: 1 }).withMessage("Policy id must be a positive integer"),
];

export const validatePolicyRequest = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));
    return next(new ApiError(400, "Validation failed", formattedErrors));
  }
  next();
};
