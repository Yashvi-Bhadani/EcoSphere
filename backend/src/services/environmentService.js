import { Prisma } from "@prisma/client";
import prisma from "../config/db.js";
import ApiError from "../utils/apiError.js";

const selectDepartment = { id: true, name: true, code: true };
const selectUser = { id: true, firstName: true, lastName: true, email: true, role: true };

const carbonEmissionInclude = {
  department: { select: selectDepartment },
  createdBy: { select: selectUser },
  emissionCategory: { select: { id: true, name: true, code: true } },
  emissionFactor: {
    select: { id: true, name: true, code: true, factorValue: true, factorUnit: true },
  },
};

const energyConsumptionInclude = {
  department: { select: selectDepartment },
  createdBy: { select: selectUser },
};

const wasteRecordInclude = {
  department: { select: selectDepartment },
  createdBy: { select: selectUser },
};

const environmentalGoalInclude = {
  department: { select: selectDepartment },
  createdBy: { select: selectUser },
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

const buildPagination = (query = {}) => {
  const page = Math.max(1, Number(query.page || 1));
  const limit = Math.min(100, Math.max(1, Number(query.limit || 20)));

  return {
    page,
    limit,
    skip: (page - 1) * limit,
    take: limit,
  };
};

const buildSort = (sortBy, sortOrder = "desc", fallback = "createdAt") => ({
  [sortBy || fallback]: sortOrder,
});

const buildSearch = (fields, search) => {
  if (!search) {
    return {};
  }

  return {
    OR: fields.map((field) => ({
      [field]: { contains: search, mode: "insensitive" },
    })),
  };
};

const buildDateRange = (fieldName, from, to) => {
  if (!from && !to) {
    return {};
  }

  return {
    [fieldName]: {
      ...(from ? { gte: new Date(from) } : {}),
      ...(to ? { lte: new Date(to) } : {}),
    },
  };
};

const toNumber = (value) => Number(value);

const normalizeCreateData = (data, config = {}) => {
  const payload = {};

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) {
      continue;
    }

    if (key === "createdById" && value === "") {
      payload[key] = null;
      continue;
    }

    if (
      typeof value === "string" &&
      /value|amount|quantity|consumption|currentValue|targetValue|baselineValue|cost|carbonEmission/i.test(key)
    ) {
      payload[key] = toNumber(value);
      continue;
    }

    if (config.dateFields?.includes(key)) {
      payload[key] = new Date(value);
      continue;
    }

    payload[key] = value;
  }

  if (config.numberFields) {
    for (const field of config.numberFields) {
      if (payload[field] !== undefined) {
        payload[field] = toNumber(payload[field]);
      }
    }
  }

  return payload;
};

const normalizeUpdateData = (data, config = {}) => {
  const payload = {};

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) {
      continue;
    }

    if (value === null) {
      payload[key] = null;
      continue;
    }

    if (
      typeof value === "string" &&
      /value|amount|quantity|consumption|currentValue|targetValue|baselineValue|cost|carbonEmission/i.test(key)
    ) {
      payload[key] = toNumber(value);
      continue;
    }

    if (config.dateFields?.includes(key)) {
      payload[key] = new Date(value);
      continue;
    }

    payload[key] = value;
  }

  return payload;
};

const countAndSum = async (model, where, sumField) => {
  const [count, aggregate] = await Promise.all([
    prisma[model].count({ where }),
    prisma[model].aggregate({
      where,
      _sum: sumField ? { [sumField]: true } : undefined,
    }),
  ]);

  return {
    count,
    total: sumField ? Number(aggregate._sum?.[sumField] || 0) : 0,
  };
};

const groupByDepartment = async (model, where, sumField) => {
  return prisma[model].groupBy({
    by: ["departmentId"],
    where,
    _count: { id: true },
    ...(sumField ? { _sum: { [sumField]: true } } : {}),
  });
};

const rawMonthlyTrend = async ({ tableName, dateField, valueField, from, to }) => {
  const clauses = [];

  if (from) {
    clauses.push(Prisma.sql`${Prisma.raw(`"${dateField}"`)} >= ${new Date(from)}`);
  }

  if (to) {
    clauses.push(Prisma.sql`${Prisma.raw(`"${dateField}"`)} <= ${new Date(to)}`);
  }

  const whereSql = clauses.length ? Prisma.sql`WHERE ${Prisma.join(clauses, Prisma.sql` AND `)}` : Prisma.empty;

  return prisma.$queryRaw`
    SELECT
      TO_CHAR(date_trunc('month', ${Prisma.raw(`"${dateField}"`)}), 'YYYY-MM') AS month,
      COUNT(*)::int AS count,
      COALESCE(SUM(${Prisma.raw(`"${valueField}"`)}), 0)::float AS total
    FROM ${Prisma.raw(`"${tableName}"`)}
    ${whereSql}
    GROUP BY 1
    ORDER BY 1 ASC
  `;
};

const buildCarbonWhere = (query = {}) => ({
  ...(query.departmentId ? { departmentId: query.departmentId } : {}),
  ...(query.createdById ? { createdById: query.createdById } : {}),
  ...(query.emissionCategoryId ? { emissionCategoryId: query.emissionCategoryId } : {}),
  ...(query.emissionFactorId ? { emissionFactorId: query.emissionFactorId } : {}),
  ...(query.scope ? { scope: query.scope } : {}),
  ...buildDateRange("emissionDate", query.from, query.to),
  ...buildSearch(["title", "activityName", "scope", "source", "notes"], query.search),
});

const buildEnergyWhere = (query = {}) => ({
  ...(query.departmentId ? { departmentId: query.departmentId } : {}),
  ...(query.createdById ? { createdById: query.createdById } : {}),
  ...(query.sourceType ? { sourceType: query.sourceType } : {}),
  ...buildDateRange("periodStart", query.from, query.to),
  ...buildSearch(["sourceType", "unit", "notes"], query.search),
});

const buildWasteWhere = (query = {}) => ({
  ...(query.departmentId ? { departmentId: query.departmentId } : {}),
  ...(query.createdById ? { createdById: query.createdById } : {}),
  ...(query.hazardous !== undefined ? { hazardous: query.hazardous } : {}),
  ...(query.recycled !== undefined ? { recycled: query.recycled } : {}),
  ...buildDateRange("recordDate", query.from, query.to),
  ...buildSearch(["wasteType", "disposalMethod", "notes"], query.search),
});

const buildGoalWhere = (query = {}) => ({
  ...(query.departmentId ? { departmentId: query.departmentId } : {}),
  ...(query.createdById ? { createdById: query.createdById } : {}),
  ...(query.status ? { status: query.status } : {}),
  ...(query.goalType ? { goalType: query.goalType } : {}),
  ...buildDateRange("targetDate", query.from, query.to),
  ...buildSearch(["title", "description", "goalType", "unit", "status"], query.search),
});

const paginateList = async (model, query, where, include, sortFallback = "createdAt") => {
  const { page, limit, skip, take } = buildPagination(query);
  const orderBy = buildSort(query.sortBy, query.sortOrder, sortFallback);

  const [items, total] = await Promise.all([
    prisma[model].findMany({
      where,
      include,
      skip,
      take,
      orderBy,
    }),
    prisma[model].count({ where }),
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

const getById = async (model, id, include, label) => {
  const record = await prisma[model].findUnique({
    where: { id },
    include,
  });

  if (!record) {
    throw new ApiError(404, `${label} not found`);
  }

  return record;
};

const createRecord = async (model, data, include, relationFields, config) => {
  const payload = normalizeCreateData(data, config);
  await validateRelations(payload, relationFields);

  return prisma[model].create({
    data: payload,
    include,
  });
};

const updateRecord = async (model, id, data, include, relationFields, config, label) => {
  await getById(model, id, include, label);
  const payload = normalizeUpdateData(data, config);
  await validateRelations(payload, relationFields);

  return prisma[model].update({
    where: { id },
    data: payload,
    include,
  });
};

const deleteRecord = async (model, id, include, label) => {
  await getById(model, id, include, label);
  return prisma[model].delete({ where: { id } });
};

const carbonConfig = {
  relationFields: ["departmentId", "createdById", "emissionCategoryId", "emissionFactorId"],
  numberFields: ["activityValue", "emissionAmount"],
  dateFields: ["emissionDate"],
};

const energyConfig = {
  relationFields: ["departmentId", "createdById"],
  numberFields: ["consumption", "cost", "carbonEmission"],
  dateFields: ["periodStart", "periodEnd"],
};

const wasteConfig = {
  relationFields: ["departmentId", "createdById"],
  numberFields: ["quantity"],
  dateFields: ["recordDate"],
};

const goalConfig = {
  relationFields: ["departmentId", "createdById"],
  numberFields: ["targetValue", "currentValue", "baselineValue"],
  dateFields: ["startDate", "targetDate", "achievedAt"],
};

export const listCarbonEmissions = async (query) =>
  paginateList("carbonEmission", query, buildCarbonWhere(query), carbonEmissionInclude);

export const getCarbonEmissionById = async (id) =>
  getById("carbonEmission", id, carbonEmissionInclude, "Carbon emission");

export const createCarbonEmission = async (data) =>
  createRecord("carbonEmission", data, carbonEmissionInclude, carbonConfig.relationFields, carbonConfig);

export const updateCarbonEmission = async (id, data) =>
  updateRecord("carbonEmission", id, data, carbonEmissionInclude, carbonConfig.relationFields, carbonConfig, "Carbon emission");

export const deleteCarbonEmission = async (id) =>
  deleteRecord("carbonEmission", id, carbonEmissionInclude, "Carbon emission");

export const listEnergyConsumptions = async (query) =>
  paginateList("energyConsumption", query, buildEnergyWhere(query), energyConsumptionInclude);

export const getEnergyConsumptionById = async (id) =>
  getById("energyConsumption", id, energyConsumptionInclude, "Energy consumption");

export const createEnergyConsumption = async (data) =>
  createRecord("energyConsumption", data, energyConsumptionInclude, energyConfig.relationFields, energyConfig);

export const updateEnergyConsumption = async (id, data) =>
  updateRecord("energyConsumption", id, data, energyConsumptionInclude, energyConfig.relationFields, energyConfig, "Energy consumption");

export const deleteEnergyConsumption = async (id) =>
  deleteRecord("energyConsumption", id, energyConsumptionInclude, "Energy consumption");

export const listWasteRecords = async (query) =>
  paginateList("wasteRecord", query, buildWasteWhere(query), wasteRecordInclude, "recordDate");

export const getWasteRecordById = async (id) =>
  getById("wasteRecord", id, wasteRecordInclude, "Waste record");

export const createWasteRecord = async (data) =>
  createRecord("wasteRecord", data, wasteRecordInclude, wasteConfig.relationFields, wasteConfig);

export const updateWasteRecord = async (id, data) =>
  updateRecord("wasteRecord", id, data, wasteRecordInclude, wasteConfig.relationFields, wasteConfig, "Waste record");

export const deleteWasteRecord = async (id) =>
  deleteRecord("wasteRecord", id, wasteRecordInclude, "Waste record");

export const listEnvironmentalGoals = async (query) =>
  paginateList("environmentalGoal", query, buildGoalWhere(query), environmentalGoalInclude, "targetDate");

export const getEnvironmentalGoalById = async (id) =>
  getById("environmentalGoal", id, environmentalGoalInclude, "Environmental goal");

export const createEnvironmentalGoal = async (data) =>
  createRecord("environmentalGoal", data, environmentalGoalInclude, goalConfig.relationFields, goalConfig);

export const updateEnvironmentalGoal = async (id, data) =>
  updateRecord("environmentalGoal", id, data, environmentalGoalInclude, goalConfig.relationFields, goalConfig, "Environmental goal");

export const deleteEnvironmentalGoal = async (id) =>
  deleteRecord("environmentalGoal", id, environmentalGoalInclude, "Environmental goal");

export const updateGoalProgress = async (id, payload) => {
  const goal = await getEnvironmentalGoalById(id);
  const currentValue = toNumber(payload.currentValue);
  const targetValue = toNumber(goal.targetValue);
  const isCompleted = currentValue >= targetValue;

  return prisma.environmentalGoal.update({
    where: { id },
    data: {
      currentValue,
      status: payload.status || (isCompleted ? "COMPLETED" : goal.status),
      achievedAt: isCompleted ? goal.achievedAt || new Date() : goal.achievedAt,
    },
    include: environmentalGoalInclude,
  });
};

export const getDepartmentWiseStatistics = async (query = {}) => {
  const [departments, carbonByDept, energyByDept, wasteByDept, goalsByDept] = await Promise.all([
    prisma.department.findMany({
      where: query.departmentId ? { id: query.departmentId } : {},
      select: { id: true, name: true, code: true },
    }),
    groupByDepartment("carbonEmission", buildCarbonWhere(query), "emissionAmount"),
    groupByDepartment("energyConsumption", buildEnergyWhere(query), "consumption"),
    groupByDepartment("wasteRecord", buildWasteWhere(query), "quantity"),
    groupByDepartment("environmentalGoal", buildGoalWhere(query), "targetValue"),
  ]);

  const departmentMap = new Map(
    departments.map((department) => [department.id, { ...department, carbon: 0, energy: 0, waste: 0, goals: 0, score: 0 }])
  );

  const mergeStats = (entries, key) => {
    for (const entry of entries) {
      const department = departmentMap.get(entry.departmentId);
      if (!department) continue;

      const sumField = entry._sum ? Object.keys(entry._sum)[0] : null;
      department[key] = sumField ? Number(entry._sum[sumField] || 0) : 0;
      department.score += department[key];
    }
  };

  mergeStats(carbonByDept, "carbon");
  mergeStats(energyByDept, "energy");
  mergeStats(wasteByDept, "waste");
  mergeStats(goalsByDept, "goals");

  return Array.from(departmentMap.values()).sort((a, b) => b.score - a.score);
};

export const getMonthlyStatistics = async (query = {}) => {
  const from = query.from || new Date(new Date().setMonth(new Date().getMonth() - 11));
  const to = query.to || new Date();

  const [carbonEmissions, energyConsumptions, wasteRecords, environmentalGoals] = await Promise.all([
    rawMonthlyTrend({ tableName: "carbon_emissions", dateField: "emissionDate", valueField: "emissionAmount", from, to }),
    rawMonthlyTrend({ tableName: "energy_consumptions", dateField: "periodStart", valueField: "consumption", from, to }),
    rawMonthlyTrend({ tableName: "waste_records", dateField: "recordDate", valueField: "quantity", from, to }),
    rawMonthlyTrend({ tableName: "environmental_goals", dateField: "targetDate", valueField: "targetValue", from, to }),
  ]);

  return {
    carbonEmissions,
    energyConsumptions,
    wasteRecords,
    environmentalGoals,
  };
};

export const getDashboardSummary = async (query = {}) => {
  const [carbon, energy, waste, goals, monthly, departmentWise, completedGoalCount] = await Promise.all([
    countAndSum("carbonEmission", buildCarbonWhere(query), "emissionAmount"),
    countAndSum("energyConsumption", buildEnergyWhere(query), "consumption"),
    countAndSum("wasteRecord", buildWasteWhere(query), "quantity"),
    countAndSum("environmentalGoal", buildGoalWhere(query), "targetValue"),
    getMonthlyStatistics(query),
    getDepartmentWiseStatistics(query),
    prisma.environmentalGoal.count({
      where: {
        ...buildGoalWhere(query),
        status: "COMPLETED",
      },
    }),
  ]);

  const goalCompletionPercentage = goals.count
    ? Number(((completedGoalCount / goals.count) * 100).toFixed(2))
    : 0;

  return {
    summary: {
      carbonEmissions: carbon,
      energyConsumptions: energy,
      wasteRecords: waste,
      environmentalGoals: goals,
      completedGoals: completedGoalCount,
      goalCompletionPercentage,
    },
    departmentWise,
    monthly,
  };
};

export const getReports = async (query = {}) => {
  const [carbonEmissions, energyConsumptions, wasteRecords, environmentalGoals] = await Promise.all([
    listCarbonEmissions({ ...query, limit: 100 }),
    listEnergyConsumptions({ ...query, limit: 100 }),
    listWasteRecords({ ...query, limit: 100 }),
    listEnvironmentalGoals({ ...query, limit: 100 }),
  ]);

  return {
    carbonEmissions,
    energyConsumptions,
    wasteRecords,
    environmentalGoals,
  };
};

export const environmentService = {
  listCarbonEmissions,
  getCarbonEmissionById,
  createCarbonEmission,
  updateCarbonEmission,
  deleteCarbonEmission,
  listEnergyConsumptions,
  getEnergyConsumptionById,
  createEnergyConsumption,
  updateEnergyConsumption,
  deleteEnergyConsumption,
  listWasteRecords,
  getWasteRecordById,
  createWasteRecord,
  updateWasteRecord,
  deleteWasteRecord,
  listEnvironmentalGoals,
  getEnvironmentalGoalById,
  createEnvironmentalGoal,
  updateEnvironmentalGoal,
  deleteEnvironmentalGoal,
  updateGoalProgress,
  getDashboardSummary,
  getDepartmentWiseStatistics,
  getMonthlyStatistics,
  getReports,
};
