import { z } from "zod";
import { loginAdmin } from "../services/authService.js";

const loginSchema = z.object({
  email: z.string().trim().email("Please provide a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long")
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
