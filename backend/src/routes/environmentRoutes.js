import { Router } from "express";
import {
  emissionCategoryController,
  emissionFactorController,
  carbonEmissionController,
  environmentalGoalController,
  wasteRecordController,
  energyConsumptionController,
} from "../controllers/environmentController.js";

const router = Router();

router
  .route("/categories")
  .get(emissionCategoryController.list)
  .post(emissionCategoryController.create);

router
  .route("/categories/:id")
  .get(emissionCategoryController.getById)
  .patch(emissionCategoryController.update)
  .delete(emissionCategoryController.remove);

router
  .route("/factors")
  .get(emissionFactorController.list)
  .post(emissionFactorController.create);

router
  .route("/factors/:id")
  .get(emissionFactorController.getById)
  .patch(emissionFactorController.update)
  .delete(emissionFactorController.remove);

router
  .route("/carbon-emissions")
  .get(carbonEmissionController.list)
  .post(carbonEmissionController.create);

router
  .route("/carbon-emissions/:id")
  .get(carbonEmissionController.getById)
  .patch(carbonEmissionController.update)
  .delete(carbonEmissionController.remove);

router
  .route("/goals")
  .get(environmentalGoalController.list)
  .post(environmentalGoalController.create);

router
  .route("/goals/:id")
  .get(environmentalGoalController.getById)
  .patch(environmentalGoalController.update)
  .delete(environmentalGoalController.remove);

router
  .route("/waste-records")
  .get(wasteRecordController.list)
  .post(wasteRecordController.create);

router
  .route("/waste-records/:id")
  .get(wasteRecordController.getById)
  .patch(wasteRecordController.update)
  .delete(wasteRecordController.remove);

router
  .route("/energy-consumptions")
  .get(energyConsumptionController.list)
  .post(energyConsumptionController.create);

router
  .route("/energy-consumptions/:id")
  .get(energyConsumptionController.getById)
  .patch(energyConsumptionController.update)
  .delete(energyConsumptionController.remove);

export default router;