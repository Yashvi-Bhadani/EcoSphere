import prisma from "../config/db.js";
import { AppError } from "../utils/errors.js";

const policyInclude = {
  createdBy: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  },
  acknowledgements: {
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  },
};

const auditInclude = {
  createdBy: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  },
};

const complianceIssueInclude = {
  reportedBy: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  },
};

export const listPolicies = async () => {
  return prisma.policy.findMany({
    orderBy: { createdAt: "desc" },
    include: policyInclude,
  });
};

export const createPolicy = async (data) => {
  return prisma.policy.create({
    data,
    include: policyInclude,
  });
};

export const getPolicyById = async (id) => {
  const policy = await prisma.policy.findUnique({
    where: { id },
    include: policyInclude,
  });

  if (!policy) {
    throw new AppError(404, `Policy with id ${id} was not found`);
  }

  return policy;
};

export const updatePolicy = async (id, data) => {
  await getPolicyById(id);

  return prisma.policy.update({
    where: { id },
    data,
    include: policyInclude,
  });
};

export const deletePolicy = async (id) => {
  await getPolicyById(id);
  await prisma.policy.delete({ where: { id } });
};

export const acknowledgePolicy = async (policyId, userId) => {
  await getPolicyById(policyId);

  const existing = await prisma.policyAcknowledgement.findUnique({
    where: {
      policyId_userId: {
        policyId,
        userId,
      },
    },
  });

  if (existing) {
    return existing;
  }

  return prisma.policyAcknowledgement.create({
    data: {
      policyId,
      userId,
    },
    include: {
      policy: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const listAudits = async () => {
  return prisma.audit.findMany({
    orderBy: { createdAt: "desc" },
    include: auditInclude,
  });
};

export const createAudit = async (data) => {
  return prisma.audit.create({
    data,
    include: auditInclude,
  });
};

export const getAuditById = async (id) => {
  const audit = await prisma.audit.findUnique({
    where: { id },
    include: auditInclude,
  });

  if (!audit) {
    throw new AppError(404, `Audit with id ${id} was not found`);
  }

  return audit;
};

export const updateAudit = async (id, data) => {
  await getAuditById(id);

  return prisma.audit.update({
    where: { id },
    data,
    include: auditInclude,
  });
};

export const listComplianceIssues = async () => {
  return prisma.complianceIssue.findMany({
    orderBy: { createdAt: "desc" },
    include: complianceIssueInclude,
  });
};

export const createComplianceIssue = async (data) => {
  return prisma.complianceIssue.create({
    data,
    include: complianceIssueInclude,
  });
};

export const getComplianceIssueById = async (id) => {
  const issue = await prisma.complianceIssue.findUnique({
    where: { id },
    include: complianceIssueInclude,
  });

  if (!issue) {
    throw new AppError(404, `Compliance issue with id ${id} was not found`);
  }

  return issue;
};

export const updateComplianceIssue = async (id, data) => {
  await getComplianceIssueById(id);

  return prisma.complianceIssue.update({
    where: { id },
    data,
    include: complianceIssueInclude,
  });
};
