import prisma from "../config/db.js";
import ApiError from "../utils/apiError.js";

const createCategoryService = async (payload) => {
  return prisma.category.create({ data: payload });
};

const getCategoriesService = async () => {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
};

const createCSRActivityService = async (payload) => {
  const category = await prisma.category.findUnique({
    where: { id: payload.categoryId },
  });

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return prisma.cSRActivity.create({ data: payload });
};

const getCSRActivitiesService = async () => {
  return prisma.cSRActivity.findMany({
    orderBy: { date: "desc" },
    include: { category: true },
  });
};

const createParticipationService = async (payload) => {
  const activity = await prisma.cSRActivity.findUnique({
    where: { id: payload.activityId },
  });

  if (!activity) {
    throw new ApiError(404, "CSR activity not found");
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return prisma.employeeParticipation.create({ data: payload });
};

const getParticipationsService = async () => {
  return prisma.employeeParticipation.findMany({
    orderBy: { completionDate: "desc" },
    include: {
      user: { select: { id: true, firstName: true, lastName: true, email: true } },
      cSRActivity: { select: { id: true, title: true, date: true, status: true } },
    },
  });
};

export {
  createCategoryService,
  getCategoriesService,
  createCSRActivityService,
  getCSRActivitiesService,
  createParticipationService,
  getParticipationsService,
};
