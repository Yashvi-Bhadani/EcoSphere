import express from "express";
import {
  getPolicies,
  getPolicy,
  createPolicy,
  updatePolicy,
  deletePolicy,
} from "../controllers/policyController.js";
import {
  createPolicyValidation,
  updatePolicyValidation,
  policyIdValidation,
  validatePolicyRequest,
} from "../validations/policyValidation.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getPolicies);
router.get("/:id", protect, policyIdValidation, validatePolicyRequest, getPolicy);
router.post(
  "/",
  protect,
  authorizeRoles("ADMIN"),
  createPolicyValidation,
  validatePolicyRequest,
  createPolicy,
);
router.put(
  "/:id",
  protect,
  authorizeRoles("ADMIN"),
  updatePolicyValidation,
  validatePolicyRequest,
  updatePolicy,
);
router.delete(
  "/:id",
  protect,
  authorizeRoles("ADMIN"),
  policyIdValidation,
  validatePolicyRequest,
  deletePolicy,
);

export default router;
