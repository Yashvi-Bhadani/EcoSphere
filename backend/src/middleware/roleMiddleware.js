
  export const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required"
        });
      }

      const userRole = req.user.role?.toUpperCase();

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: "Insufficient permissions"
        });
      }

      next();
    };
  };

  
