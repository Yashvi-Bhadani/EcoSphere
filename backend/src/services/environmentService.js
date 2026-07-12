import prisma from "../config/db.js";
import ApiError from "../utils/apiError.js";

const entityConfigs = {
  emissionCategories: {
    delegate: "emissionCategory",
    label: "Emission category",
    include: {
      department: { select: { id: true, name: true, code: true } },
      createdBy: { select: { id: true, name: true, email: true, role: true } },
      emissionFactors: {
        select: { id: true, name: true, code: true, factorValue: true, factorUnit: true, isActive: true },
      },
      carbonEmissions: {
        select: { id: true, title: true, emissionAmount: true, emissionDate: true },
      },
    },
  },
  emissionFactors: {
    delegate: "emissionFactor",
    label: "Emission factor",
    include: {
      department: { select: { id: true, name: true, code: true } },
      createdBy: { select: { id: true, name: true, email: true, role: true } },
      emissionCategory: { select: { id: true, name: true, code: true } },
      carbonEmissions: {
        select: { id: true, title: true, emissionAmount: true, emissionDate: true },
      },
    },
  },
  carbonEmissions: {
    delegate: "carbonEmission",
    label: "Carbon emission",
    include: {
      department: { select: { id: true, name: true, code: true } },
      createdBy: { select: { id: true, name: true, email: true, role: true } },
      emissionCategory: { select: { id: true, name: true, code: true } },
      emissionFactor: {
        select: { id: true, name: true, code: true, factorValue: true, factorUnit: true },
      },
    },
  },
  environmentalGoals: {
    delegate: "environmentalGoal",
    label: "Environmental goal",
    include: {
      department: { select: { id: true, name: true, code: true } },
      createdBy: { select: { id: true, name: true, email: true, role: true } },
    },
  },
  wasteRecords: {
    delegate: "wasteRecord",
    label: "Waste record",
    include: {
      department: { select: { id: true, name: true, code: true } },
      createdBy: { select: { id: true, name: true, email: true, role: true } },
    },
  },
  energyConsumptions: {
    delegate: "energyConsumption",
    label: "Energy consumption",
    include: {
      department: { select: { id: true, name: true, code: true } },
      createdBy: { select: { id: true, name: true, email: true, role: true } },
    },
  },
};

const relationChecks = {
  departmentId: { delegate: "department", label: "Department" },
  createdById: { delegate: "user", label: "User" },
  emissionCategoryId: { delegate: "emissionCategory", label: "Emission category" },
  emissionFactorId: { delegate: "emissionFactor", label: "Emission factor" },
};

const ensureRecordExists = async (delegate, id, label) => {
  const record = await prisma[delegate].findUnique({
    where: { id },
    select: { id: true },
  });

  if (!record) {
    throw new ApiError(404, `${label} not found`);
  }
};

const validateRelations = async (data) => {
  const checks = Object.entries(relationChecks).filter(([field]) => data[field] !== undefined);

  for (const [field, config] of checks) {
    await ensureRecordExists(config.delegate, data[field], config.label);
  }
};

const buildPagination = (page, limit) => ({
  skip: (page - 1) * limit,
  take: limit,
});

const getConfig = (entityKey) => {
  const config = entityConfigs[entityKey];

  if (!config) {
    throw new ApiError(500, `Unknown environment entity: ${entityKey}`);
  }

  return config;
};

export const listEntities = async (entityKey, { page, limit }) => {
  const config = getConfig(entityKey);
  const { skip, take } = buildPagination(page, limit);

  const [items, total] = await Promise.all([
    prisma[config.delegate].findMany({
      include: config.include,
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    prisma[config.delegate].count(),
  ]);

  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
};

export const getEntityById = async (entityKey, id) => {
  const config = getConfig(entityKey);
  const item = await prisma[config.delegate].findUnique({
    where: { id },
    include: config.include,
  });

  if (!item) {
    throw new ApiError(404, `${config.label} not found`);
  }

  return item;
};

export const createEntity = async (entityKey, data) => {
  const config = getConfig(entityKey);
  await validateRelations(data);

  return prisma[config.delegate].create({
    data,
    include: config.include,
  });
};

export const updateEntity = async (entityKey, id, data) => {
  const config = getConfig(entityKey);
  await getEntityById(entityKey, id);
  await validateRelations(data);

  return prisma[config.delegate].update({
    where: { id },
    data,
    include: config.include,
  });
};

export const deleteEntity = async (entityKey, id) => {
  const config = getConfig(entityKey);
  await getEntityById(entityKey, id);

  return prisma[config.delegate].delete({
    where: { id },
  });
};

export const environmentService = {
  listEntities,
  getEntityById,
  createEntity,
  updateEntity,
  deleteEntity,
};