import asyncHandler from "../utils/asyncHandler.js";
import {
  createCategoryService,
  getCategoriesService,
  createCSRActivityService,
  getCSRActivitiesService,
  createParticipationService,
  getParticipationsService,
} from "../services/socialService.js";

const createCategory = asyncHandler(async (req, res) => {
  const { name, type, status } = req.body;

  if (!name || !type || !status) {
    return res.status(400).json({
      success: false,
      message: "name, type, and status are required",
    });
  }

  const category = await createCategoryService({ name, type, status });

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: category,
  });
});

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await getCategoriesService();

  res.status(200).json({
    success: true,
    message: "Categories fetched successfully",
    data: categories,
  });
});

const createCSRActivity = asyncHandler(async (req, res) => {
  const { title, description, date, status, categoryId } = req.body;

  if (!title || !description || !date || !status || !categoryId) {
    return res.status(400).json({
      success: false,
      message: "title, description, date, status, and categoryId are required",
    });
  }

  const activity = await createCSRActivityService({
    title,
    description,
    date,
    status,
    categoryId,
  });

  res.status(201).json({
    success: true,
    message: "CSR activity created successfully",
    data: activity,
  });
});

const getAllCSRActivities = asyncHandler(async (req, res) => {
  const activities = await getCSRActivitiesService();

  res.status(200).json({
    success: true,
    message: "CSR activities fetched successfully",
    data: activities,
  });
});

const addParticipation = asyncHandler(async (req, res) => {
  const { userId, activityId, proof, approvalStatus, pointsEarned, completionDate } = req.body;

  if (!userId || !activityId || !proof || !approvalStatus || pointsEarned === undefined || !completionDate) {
    return res.status(400).json({
      success: false,
      message: "userId, activityId, proof, approvalStatus, pointsEarned, and completionDate are required",
    });
  }

  const participation = await createParticipationService({
    userId,
    activityId,
    proof,
    approvalStatus,
    pointsEarned,
    completionDate,
  });

  res.status(201).json({
    success: true,
    message: "Participation recorded successfully",
    data: participation,
  });
});

const getParticipations = asyncHandler(async (req, res) => {
  const participations = await getParticipationsService();

  res.status(200).json({
    success: true,
    message: "Participations fetched successfully",
    data: participations,
  });
});

export {
  createCategory,
  getAllCategories,
  createCSRActivity,
  getAllCSRActivities,
  addParticipation,
  getParticipations,
};
