import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import ApiError from "./apiError.js";

export const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const details = err.details || null;

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.flatten(),
    });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "A record with the same unique value already exists",
        details: err.meta,
      });
    }

    if (err.code === "P2003") {
      return res.status(400).json({
        success: false,
        message: "Related record not found",
        details: err.meta,
      });
    }

    if (err.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Record not found",
      });
    }
  }

  return res.status(statusCode).json({
    success: false,
    message,
    details,
  });
};