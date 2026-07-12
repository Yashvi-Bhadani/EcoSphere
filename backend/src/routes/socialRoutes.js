import express from "express";
import {
  createCategory,
  getAllCategories,
  createCSRActivity,
  getAllCSRActivities,
  addParticipation,
  getParticipations,
} from "../controllers/socialController.js";

const router = express.Router();

// Category Routes
router.post("/categories", createCategory);
router.get("/categories", getAllCategories);

// CSR Activity Routes
router.post("/activities", createCSRActivity);
router.get("/activities", getAllCSRActivities);

// Employee Participation Routes
router.post("/participations", addParticipation);
router.get("/participations", getParticipations);

export default router;