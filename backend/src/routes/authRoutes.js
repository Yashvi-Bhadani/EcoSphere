import express from "express";
import jwt from "jsonwebtoken";
import {
  changePassword,
  createUser,
  getProfile,
  login
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

const optionalAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  try {
    const token = authHeader.split(" ")[1]?.trim();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    next();
  }
};

router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Authentication module is working."
  });
});

router.post("/login", login);
router.post("/create-user", optionalAuthMiddleware, createUser);
router.get("/profile", authMiddleware, getProfile);
router.put("/change-password", authMiddleware, changePassword);

export default router;

