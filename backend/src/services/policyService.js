import prisma from "../config/db.js";
import ApiError from "../utils/apiError.js";

export const getAllPolicies = async () => {
  return prisma.policy.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
};

export const getPolicyById = async (id) => {
  const policy = await prisma.policy.findUnique({
    where: { id },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  if (!policy) {
    throw new ApiError(404, "Policy not found");
  }

  return policy;
};

export const createPolicy = async (payload, user) => {
  return prisma.policy.create({
    data: {
      title: payload.title,
      description: payload.description,
      category: payload.category,
      version: payload.version,
      effectiveDate: payload.effectiveDate ? new Date(payload.effectiveDate) : null,
      status: payload.status || "DRAFT",
      createdById: user.id,
    },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
};

export const updatePolicy = async (id, payload) => {
  await getPolicyById(id);

  return prisma.policy.update({
    where: { id },
    data: {
      ...(payload.title && { title: payload.title }),
      ...(payload.description && { description: payload.description }),
      ...(payload.category && { category: payload.category }),
      ...(payload.version && { version: payload.version }),
      ...(payload.effectiveDate !== undefined && { effectiveDate: payload.effectiveDate ? new Date(payload.effectiveDate) : null }),
      ...(payload.status && { status: payload.status }),
    },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
};

export const deletePolicy = async (id) => {
  await getPolicyById(id);
  await prisma.policy.delete({ where: { id } });
};
