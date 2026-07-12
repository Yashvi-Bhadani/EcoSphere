import { Prisma } from "@prisma/client";
import prisma from "../config/db.js";
import ApiError from "../utils/apiError.js";

const carbonEmissionInclude = {
  department: { select: { id: true, name: true, code: true } },
  createdBy: { select: { id: true, name: true, email: true, role: true } },
  emissionCategory: { select: { id: true, name: true, code: true } },
  emissionFactor: {
    select: { id: true, name: true, code: true, factorValue: true, factorUnit: true },
  },
};

const energyConsumptionInclude = {
  department: { select: { id: true, name: true, code: true } },
  createdBy: { select: { id: true, name: true, email: true, role: true } },
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

const validateRelations = async (data, fields) => {
  for (const field of fields) {
    if (data[field] !== undefined && data[field] !== null) {
      const config = relationChecks[field];
      await ensureRecordExists(config.delegate, data[field], config.label);
    }
  }
};

const buildPagination = ({ page = 1, limit = 20 }) => {
  const safePage = Math.max(1, Number(page));
  const safeLimit = Math.min(100, Math.max(1, Number(limit)));

  return {
    page: safePage,
    limit: safeLimit,
    skip: (safePage - 1) * safeLimit,
    take: safeLimit,
  };
};

const toDecimal = (value) => new Prisma.Decimal(value);

const buildSearchWhere = (fields, search) => {
  if (!search) {
    return {};
  }

  return {
    OR: fields.map((field) => ({
      [field]: { contains: search, mode: "insensitive" },
    })),
  };
};

const buildCarbonEmissionWhere = (query) => {
  const where = {
    ...(query.departmentId ? { departmentId: query.departmentId } : {}),
    ...(query.createdById ? { createdById: query.createdById } : {}),
    ...(query.emissionCategoryId ? { emissionCategoryId: query.emissionCategoryId } : {}),
    ...(query.emissionFactorId ? { emissionFactorId: query.emissionFactorId } : {}),
    ...(query.scope ? { scope: query.scope } : {}),
    ...(query.from || query.to
      ? {
          emissionDate: {
            ...(query.from ? { gte: new Date(query.from) } : {}),
            ...(query.to ? { lte: new Date(query.to) } : {}),
          },
        }
      : {}),
    ...buildSearchWhere(["title", "activityName", "scope", "source", "notes"], query.search),
  };

  return where;
};

const buildEnergyConsumptionWhere = (query) => {
  const where = {
    ...(query.departmentId ? { departmentId: query.departmentId } : {}),
    ...(query.createdById ? { createdById: query.createdById } : {}),
    ...(query.sourceType ? { sourceType: query.sourceType } : {}),
    ...(query.from || query.to
      ? {
          periodStart: {
            ...(query.from ? { gte: new Date(query.from) } : {}),
            ...(query.to ? { lte: new Date(query.to) } : {}),
          },
        }
      : {}),
    ...buildSearchWhere(["sourceType", "unit", "notes"], query.search),
  };

  return where;
};

const buildOrderBy = (sortBy, sortOrder = "desc") => ({
  [sortBy || "createdAt"]: sortOrder,
});

const buildListResponse = (items, total, page, limit) => ({
  items,
  meta: {
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  },
});

const normalizeCarbonEmissionData = (data) => ({
  title: data.title,
  activityName: data.activityName,
  activityValue: toDecimal(data.activityValue),
  activityUnit: data.activityUnit,
  emissionAmount: toDecimal(data.emissionAmount),
  scope: data.scope || null,
  emissionDate: new Date(data.emissionDate),
  notes: data.notes || null,
  source: data.source || null,
  emissionCategoryId: data.emissionCategoryId,
  emissionFactorId: data.emissionFactorId || null,
  departmentId: data.departmentId,
  createdById: data.createdById || null,
});

const normalizeCarbonEmissionUpdateData = (data) => {
  const payload = {};

  if (data.title !== undefined) payload.title = data.title;
  if (data.activityName !== undefined) payload.activityName = data.activityName;
  if (data.activityValue !== undefined) payload.activityValue = toDecimal(data.activityValue);
  if (data.activityUnit !== undefined) payload.activityUnit = data.activityUnit;
  if (data.emissionAmount !== undefined) payload.emissionAmount = toDecimal(data.emissionAmount);
  if (data.scope !== undefined) payload.scope = data.scope;
  if (data.emissionDate !== undefined) payload.emissionDate = new Date(data.emissionDate);
  if (data.notes !== undefined) payload.notes = data.notes;
  if (data.source !== undefined) payload.source = data.source;
  if (data.emissionCategoryId !== undefined) payload.emissionCategoryId = data.emissionCategoryId;
  if (data.emissionFactorId !== undefined) payload.emissionFactorId = data.emissionFactorId;
  if (data.departmentId !== undefined) payload.departmentId = data.departmentId;
  if (data.createdById !== undefined) payload.createdById = data.createdById;

  return payload;
};

const normalizeEnergyConsumptionData = (data) => ({
  sourceType: data.sourceType,
  consumption: toDecimal(data.consumption),
  unit: data.unit,
  periodStart: new Date(data.periodStart),
  periodEnd: new Date(data.periodEnd),
  cost: data.cost !== undefined && data.cost !== null ? toDecimal(data.cost) : null,
  carbonEmission:
    data.carbonEmission !== undefined && data.carbonEmission !== null
      ? toDecimal(data.carbonEmission)
      : null,
  notes: data.notes || null,
  departmentId: data.departmentId,
  createdById: data.createdById || null,
});

const normalizeEnergyConsumptionUpdateData = (data) => {
  const payload = {};

  if (data.sourceType !== undefined) payload.sourceType = data.sourceType;
  if (data.consumption !== undefined) payload.consumption = toDecimal(data.consumption);
  if (data.unit !== undefined) payload.unit = data.unit;
  if (data.periodStart !== undefined) payload.periodStart = new Date(data.periodStart);
  if (data.periodEnd !== undefined) payload.periodEnd = new Date(data.periodEnd);
  if (data.cost !== undefined) {
    payload.cost = data.cost === null || data.cost === "" ? null : toDecimal(data.cost);
  }
  if (data.carbonEmission !== undefined) {
    payload.carbonEmission =
      data.carbonEmission === null || data.carbonEmission === "" ? null : toDecimal(data.carbonEmission);
  }
  if (data.notes !== undefined) payload.notes = data.notes;
  if (data.departmentId !== undefined) payload.departmentId = data.departmentId;
  if (data.createdById !== undefined) payload.createdById = data.createdById;

  return payload;
};

const resolvePagination = (query) => buildPagination(query);

export const listCarbonEmissions = async (query) => {
  const { page, limit, skip, take } = resolvePagination(query);
  const where = buildCarbonEmissionWhere(query);
  const orderBy = buildOrderBy(query.sortBy, query.sortOrder);

  const [items, total] = await Promise.all([
    prisma.carbonEmission.findMany({
      where,
      include: carbonEmissionInclude,
      orderBy,
      skip,
      take,
    }),
    prisma.carbonEmission.count({ where }),
  ]);

  return buildListResponse(items, total, page, limit);
};

export const getCarbonEmissionById = async (id) => {
  const record = await prisma.carbonEmission.findUnique({
    where: { id },
    include: carbonEmissionInclude,
  });

  if (!record) {
    throw new ApiError(404, "Carbon emission not found");
  }

  return record;
};

export const createCarbonEmission = async (data) => {
  const payload = normalizeCarbonEmissionData(data);
  await validateRelations(payload, ["departmentId", "createdById", "emissionCategoryId", "emissionFactorId"]);

  return prisma.carbonEmission.create({
    data: payload,
    include: carbonEmissionInclude,
  });
};

export const updateCarbonEmission = async (id, data) => {
  await getCarbonEmissionById(id);
  const payload = normalizeCarbonEmissionUpdateData(data);
  await validateRelations(payload, ["departmentId", "createdById", "emissionCategoryId", "emissionFactorId"]);

  return prisma.carbonEmission.update({
    where: { id },
    data: payload,
    include: carbonEmissionInclude,
  });
};

export const deleteCarbonEmission = async (id) => {
  await getCarbonEmissionById(id);

  return prisma.carbonEmission.delete({
    where: { id },
  });
};

export const getCarbonEmissionReport = async (query) => {
  const where = buildCarbonEmissionWhere(query);

  const [aggregate, byScope, recentRecords] = await Promise.all([
    prisma.carbonEmission.aggregate({
      where,
      _count: { id: true },
      _sum: { emissionAmount: true, activityValue: true },
      _avg: { emissionAmount: true },
    }),
    prisma.carbonEmission.groupBy({
      by: ["scope"],
      where,
      _count: { id: true },
      _sum: { emissionAmount: true },
      orderBy: { _sum: { emissionAmount: "desc" } },
    }),
    prisma.carbonEmission.findMany({
      where,
      include: carbonEmissionInclude,
      orderBy: { emissionDate: "desc" },
      take: 5,
    }),
  ]);

  return {
    summary: {
      count: aggregate._count.id,
      totalEmissionAmount: aggregate._sum.emissionAmount,
      totalActivityValue: aggregate._sum.activityValue,
      averageEmissionAmount: aggregate._avg.emissionAmount,
    },
    byScope,
    recentRecords,
  };
};

export const listEnergyConsumptions = async (query) => {
  const { page, limit, skip, take } = resolvePagination(query);
  const where = buildEnergyConsumptionWhere(query);
  const orderBy = buildOrderBy(query.sortBy, query.sortOrder);

  const [items, total] = await Promise.all([
    prisma.energyConsumption.findMany({
      where,
      include: energyConsumptionInclude,
      orderBy,
      skip,
      take,
    }),
    prisma.energyConsumption.count({ where }),
  ]);

  return buildListResponse(items, total, page, limit);
};

export const getEnergyConsumptionById = async (id) => {
  const record = await prisma.energyConsumption.findUnique({
    where: { id },
    include: energyConsumptionInclude,
  });

  if (!record) {
    throw new ApiError(404, "Energy consumption not found");
  }

  return record;
};

export const createEnergyConsumption = async (data) => {
  const payload = normalizeEnergyConsumptionData(data);
  await validateRelations(payload, ["departmentId", "createdById"]);

  return prisma.energyConsumption.create({
    data: payload,
    include: energyConsumptionInclude,
  });
};

export const updateEnergyConsumption = async (id, data) => {
  await getEnergyConsumptionById(id);
  const payload = normalizeEnergyConsumptionUpdateData(data);
  await validateRelations(payload, ["departmentId", "createdById"]);

  return prisma.energyConsumption.update({
    where: { id },
    data: payload,
    include: energyConsumptionInclude,
  });
};

export const deleteEnergyConsumption = async (id) => {
  await getEnergyConsumptionById(id);

  return prisma.energyConsumption.delete({
    where: { id },
  });
};

export const getEnergyConsumptionReport = async (query) => {
  const where = buildEnergyConsumptionWhere(query);

  const [aggregate, bySourceType, recentRecords] = await Promise.all([
    prisma.energyConsumption.aggregate({
      where,
      _count: { id: true },
      _sum: { consumption: true, cost: true, carbonEmission: true },
      _avg: { consumption: true },
    }),
    prisma.energyConsumption.groupBy({
      by: ["sourceType"],
      where,
      _count: { id: true },
      _sum: { consumption: true },
      orderBy: { _sum: { consumption: "desc" } },
    }),
    prisma.energyConsumption.findMany({
      where,
      include: energyConsumptionInclude,
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return {
    summary: {
      count: aggregate._count.id,
      totalConsumption: aggregate._sum.consumption,
      totalCost: aggregate._sum.cost,
      totalCarbonEmission: aggregate._sum.carbonEmission,
      averageConsumption: aggregate._avg.consumption,
    },
    bySourceType,
    recentRecords,
  };
};

export const environmentService = {
  listCarbonEmissions,
  getCarbonEmissionById,
  createCarbonEmission,
  updateCarbonEmission,
  deleteCarbonEmission,
  getCarbonEmissionReport,
  listEnergyConsumptions,
  getEnergyConsumptionById,
  createEnergyConsumption,
  updateEnergyConsumption,
  deleteEnergyConsumption,
  getEnergyConsumptionReport,
};