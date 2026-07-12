import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import ApiError from "./apiError.js";

export const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const errors = Array.isArray(err.details) ? err.details : err.details ? [err.details] : [];

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.issues?.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })) || [],
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "A record with the same unique value already exists",
        errors: [{ field: err.meta?.target, message: err.message }],
      });
    }

    if (err.code === "P2003") {
      return res.status(400).json({
        success: false,
        message: "Related record not found",
        errors: [{ field: err.meta?.field_name, message: err.message }],
      });
    }

    if (err.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Record not found",
        errors: [],
      });
    }
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};