import express from "express";
import {
  changePassword,
  createUser,
  getProfile,
  login
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Authentication module is working."
  });
});

router.post("/login", login);
router.post("/create-user", authMiddleware, roleMiddleware("ADMIN"), createUser);
router.get("/profile", authMiddleware, getProfile);
router.put("/change-password", authMiddleware, changePassword);

export default router;

