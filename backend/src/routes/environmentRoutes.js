import { Router } from "express";
import {
  carbonEmissionController,
  energyConsumptionController,
  wasteRecordController,
  environmentalGoalController,
} from "../controllers/environmentController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = Router();
const readAccess = [authMiddleware, roleMiddleware("ADMIN", "EMPLOYEE")];
const writeAccess = [authMiddleware, roleMiddleware("ADMIN")];

router
  .route("/carbon-emissions")
  .get(...readAccess, carbonEmissionController.list)
  .post(...writeAccess, carbonEmissionController.create);

router
  .route("/carbon-emissions/:id")
  .get(...readAccess, carbonEmissionController.getById)
  .put(...writeAccess, carbonEmissionController.update)
  .delete(...writeAccess, carbonEmissionController.remove);

router
  .route("/energy-consumptions")
  .get(...readAccess, energyConsumptionController.list)
  .post(...writeAccess, energyConsumptionController.create);

router
  .route("/energy-consumptions/:id")
  .get(...readAccess, energyConsumptionController.getById)
  .put(...writeAccess, energyConsumptionController.update)
  .delete(...writeAccess, energyConsumptionController.remove);

router
  .route("/waste-records")
  .get(...readAccess, wasteRecordController.list)
  .post(...writeAccess, wasteRecordController.create);

router
  .route("/waste-records/:id")
  .get(...readAccess, wasteRecordController.getById)
  .put(...writeAccess, wasteRecordController.update)
  .delete(...writeAccess, wasteRecordController.remove);

router
  .route("/environmental-goals")
  .get(...readAccess, environmentalGoalController.list)
  .post(...writeAccess, environmentalGoalController.create);

router
  .route("/environmental-goals/:id")
  .get(...readAccess, environmentalGoalController.getById)
  .put(...writeAccess, environmentalGoalController.update)
  .delete(...writeAccess, environmentalGoalController.remove);

router
  .route("/environmental-goals/:id/progress")
  .put(...writeAccess, environmentalGoalController.progress);

export default router;
