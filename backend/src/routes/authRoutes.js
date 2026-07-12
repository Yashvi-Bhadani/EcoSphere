import express from "express";
import { login } from "../controllers/authController.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Authentication module is working."
  });
});

router.post("/login", login);

export default router;
