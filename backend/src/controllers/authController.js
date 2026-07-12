import { z } from "zod";
import {
  changePassword as changePasswordService,
  createUser as createUserService,
  getUserProfile as getUserProfileService,
  loginAdmin
} from "../services/authService.js";

const loginSchema = z.object({
  email: z.string().trim().email("Please provide a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long")
});

const createUserSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().email("Please provide a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  role: z.enum(["ADMIN", "MANAGER", "EMPLOYEE"]).optional(),
  departmentId: z.string().trim().optional().nullable(),
  isActive: z.boolean().optional()
});

const changePasswordSchema = z.object({
  oldPassword: z.string().min(8, "Current password must be at least 8 characters long"),
  newPassword: z.string().min(8, "New password must be at least 8 characters long")
});

export const login = async (req, res) => {
  try {
    const parsedBody = loginSchema.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsedBody.error.flatten().fieldErrors
      });
    }

    const result = await loginAdmin(parsedBody.data);

    return res.status(200).json({
      success: true,
      message: "Administrator logged in successfully",
      data: result
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Unable to process login request";

    return res.status(statusCode).json({
      success: false,
      message
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const parsedBody = createUserSchema.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsedBody.error.flatten().fieldErrors
      });
    }

    const result = await createUserService(parsedBody.data);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: result
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Unable to create user";

    return res.status(statusCode).json({
      success: false,
      message
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const result = await getUserProfileService(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: result
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Unable to fetch profile";

    return res.status(statusCode).json({
      success: false,
      message
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const parsedBody = changePasswordSchema.safeParse(req.body);

    if (!parsedBody.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: parsedBody.error.flatten().fieldErrors
      });
    }

    const result = await changePasswordService(req.user.id, parsedBody.data);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: result
    });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Unable to change password";

    return res.status(statusCode).json({
      success: false,
      message
    });
  }
};
