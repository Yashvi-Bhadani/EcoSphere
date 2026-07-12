import {
  createPolicySchema,
  createAuditSchema,
  createComplianceIssueSchema,
  updatePolicySchema,
  updateAuditSchema,
  updateComplianceIssueSchema,
  idParamSchema,
  policyIdParamSchema,
  acknowledgePolicySchema,
} from "../validations/governanceValidation.js";
import * as governanceService from "../services/governanceService.js";
import { asyncHandler } from "../utils/errors.js";

export const listPolicies = asyncHandler(async (req, res) => {
  const policies = await governanceService.listPolicies();
  res.status(200).json({ success: true, data: policies });
});

export const createPolicy = asyncHandler(async (req, res) => {
  const payload = createPolicySchema.parse(req.body);
  const policy = await governanceService.createPolicy(payload);
  res.status(201).json({ success: true, data: policy });
});

export const getPolicy = asyncHandler(async (req, res) => {
  const { id } = idParamSchema.parse(req.params);
  const policy = await governanceService.getPolicyById(id);
  res.status(200).json({ success: true, data: policy });
});

export const updatePolicy = asyncHandler(async (req, res) => {
  const { id } = idParamSchema.parse(req.params);
  const payload = updatePolicySchema.parse(req.body);
  const policy = await governanceService.updatePolicy(id, payload);
  res.status(200).json({ success: true, data: policy });
});

export const deletePolicy = asyncHandler(async (req, res) => {
  const { id } = idParamSchema.parse(req.params);
  await governanceService.deletePolicy(id);
  res.status(204).send();
});

export const acknowledgePolicy = asyncHandler(async (req, res) => {
  const { policyId } = policyIdParamSchema.parse(req.params);
  const payload = acknowledgePolicySchema.parse(req.body);
  const acknowledgement = await governanceService.acknowledgePolicy(policyId, payload.userId);
  res.status(201).json({ success: true, data: acknowledgement });
});

export const listAudits = asyncHandler(async (req, res) => {
  const audits = await governanceService.listAudits();
  res.status(200).json({ success: true, data: audits });
});

export const createAudit = asyncHandler(async (req, res) => {
  const payload = createAuditSchema.parse(req.body);
  const audit = await governanceService.createAudit(payload);
  res.status(201).json({ success: true, data: audit });
});

export const getAudit = asyncHandler(async (req, res) => {
  const { id } = idParamSchema.parse(req.params);
  const audit = await governanceService.getAuditById(id);
  res.status(200).json({ success: true, data: audit });
});

export const updateAudit = asyncHandler(async (req, res) => {
  const { id } = idParamSchema.parse(req.params);
  const payload = updateAuditSchema.parse(req.body);
  const audit = await governanceService.updateAudit(id, payload);
  res.status(200).json({ success: true, data: audit });
});

export const listComplianceIssues = asyncHandler(async (req, res) => {
  const issues = await governanceService.listComplianceIssues();
  res.status(200).json({ success: true, data: issues });
});

export const createComplianceIssue = asyncHandler(async (req, res) => {
  const payload = createComplianceIssueSchema.parse(req.body);
  const issue = await governanceService.createComplianceIssue(payload);
  res.status(201).json({ success: true, data: issue });
});

export const getComplianceIssue = asyncHandler(async (req, res) => {
  const { id } = idParamSchema.parse(req.params);
  const issue = await governanceService.getComplianceIssueById(id);
  res.status(200).json({ success: true, data: issue });
});

export const updateComplianceIssue = asyncHandler(async (req, res) => {
  const { id } = idParamSchema.parse(req.params);
  const payload = updateComplianceIssueSchema.parse(req.body);
  const issue = await governanceService.updateComplianceIssue(id, payload);
  res.status(200).json({ success: true, data: issue });
});
