import { Router } from "express";
import {
  carbonEmissionController,
  energyConsumptionController,
} from "../controllers/environmentController.js";
import {
  carbonEmissionCreateValidation,
  carbonEmissionUpdateValidation,
  carbonEmissionListValidators,
  carbonEmissionReportValidators,
  energyConsumptionCreateValidation,
  energyConsumptionUpdateValidation,
  energyConsumptionListValidators,
  energyConsumptionReportValidators,
  idParamValidators,
} from "../validations/environmentValidation.js";

const router = Router();

router
  .route("/carbon-emissions")
  .get(carbonEmissionListValidators, carbonEmissionController.list)
  .post(carbonEmissionCreateValidation, carbonEmissionController.create);

router
  .route("/carbon-emissions/:id")
  .get(idParamValidators, carbonEmissionController.getById)
  .put(idParamValidators, carbonEmissionUpdateValidation, carbonEmissionController.update)
  .delete(idParamValidators, carbonEmissionController.remove);

router
  .route("/carbon-emissions/reports")
  .get(carbonEmissionReportValidators, carbonEmissionController.report);

router
  .route("/energy-consumptions")
  .get(energyConsumptionListValidators, energyConsumptionController.list)
  .post(energyConsumptionCreateValidation, energyConsumptionController.create);

router
  .route("/energy-consumptions/:id")
  .get(idParamValidators, energyConsumptionController.getById)
  .put(idParamValidators, energyConsumptionUpdateValidation, energyConsumptionController.update)
  .delete(idParamValidators, energyConsumptionController.remove);

router
  .route("/energy-consumptions/reports")
  .get(energyConsumptionReportValidators, energyConsumptionController.report);

export default router;