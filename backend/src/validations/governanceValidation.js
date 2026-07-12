import { z } from "zod";

const policyStatusSchema = z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]);
const auditTypeSchema = z.enum(["INTERNAL", "EXTERNAL"]);
const auditStatusSchema = z.enum(["PLANNED", "IN_PROGRESS", "COMPLETED"]);
const severitySchema = z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]);
const complianceStatusSchema = z.enum(["OPEN", "IN_REVIEW", "RESOLVED"]);

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const policyIdParamSchema = z.object({
  policyId: z.coerce.number().int().positive(),
});

export const createPolicySchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  version: z.string().trim().min(1, "Version is required"),
  content: z.string().trim().min(10, "Content must be at least 10 characters"),
  status: policyStatusSchema.optional(),
  effectiveDate: z.coerce.date().optional(),
  createdById: z.coerce.number().int().positive(),
});

export const updatePolicySchema = createPolicySchema.partial();

export const acknowledgePolicySchema = z.object({
  userId: z.coerce.number().int().positive(),
});

export const createAuditSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  auditType: auditTypeSchema.optional(),
  status: auditStatusSchema.optional(),
  findings: z.string().trim().max(2000).optional(),
  scheduledDate: z.coerce.date().optional(),
  completedAt: z.coerce.date().optional(),
  createdById: z.coerce.number().int().positive(),
});

export const updateAuditSchema = createAuditSchema.partial();

export const createComplianceIssueSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  severity: severitySchema.optional(),
  status: complianceStatusSchema.optional(),
  reportedById: z.coerce.number().int().positive(),
  dueDate: z.coerce.date().optional(),
  resolvedAt: z.coerce.date().optional(),
});

export const updateComplianceIssueSchema = createComplianceIssueSchema.partial();
