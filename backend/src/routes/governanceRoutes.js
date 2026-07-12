import express from "express";
import {
  listAudits,
  createAudit,
  getAudit,
  updateAudit,
  listComplianceIssues,
  createComplianceIssue,
  getComplianceIssue,
  updateComplianceIssue,
} from "../controllers/governanceController.js";

const router = express.Router();

router.get("/audits", listAudits);
router.post("/audits", createAudit);
router.get("/audits/:id", getAudit);
router.patch("/audits/:id", updateAudit);

router.get("/compliance-issues", listComplianceIssues);
router.post("/compliance-issues", createComplianceIssue);
router.get("/compliance-issues/:id", getComplianceIssue);
router.patch("/compliance-issues/:id", updateComplianceIssue);

export default router;
