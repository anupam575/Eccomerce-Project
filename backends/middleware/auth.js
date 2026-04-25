
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
export const isAuthenticatedUser = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({ success: false });
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false });
    }

    const user = await User.findById(decoded.id).populate("role");

    if (!user) {
      return res.status(401).json({ success: false });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false });
    }

    req.user = user;
    next();

  } catch (err) {
    return res.status(500).json({ success: false });
  }
};




export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Check authentication
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User not authenticated",
        });
      }

      // Get role_key from populated role
      const userRoleKey = req.user.role?.role_key;

      if (!userRoleKey) {
        return res.status(403).json({
          success: false,
          message: "User role not found",
        });
      }

      // Normalize role (DB stores lowercase)
      const normalizedRole = userRoleKey.toLowerCase();

      // Normalize allowed roles once
      const normalizedAllowedRoles = allowedRoles.map(role =>
        role.toLowerCase()
      );

      // Check permission
      if (!normalizedAllowedRoles.includes(normalizedRole)) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }

      next();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Server error in role authorization",
      });
    }
  };
};