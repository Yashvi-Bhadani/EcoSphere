import jwt from "jsonwebtoken";
import prisma from "../config/db.js";
import ApiError from "../utils/apiError.js";

/**
 * Extract Bearer token from Authorization header
 */
const getBearerToken = (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.split(" ")[1].trim();
};

/**
 * Verify JWT token
 */
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Authentication Middleware
 */
export const protect = async (req, _res, next) => {
  try {
    const token = getBearerToken(req);

    if (!token) {
      return next(new ApiError(401, "Authentication token is required"));
    }

    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return next(new ApiError(401, "User not found"));
    }

    req.user = user;

    next();
  } catch (error) {
    next(new ApiError(401, "Invalid or expired token"));
  }
};

/**
 * Role Authorization Middleware
 */
export const authorizeRoles = (...roles) => {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Authentication required"));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(403, "You are not authorized to perform this action")
      );
    }

    next();
  };
};