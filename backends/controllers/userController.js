import jwt from "jsonwebtoken"; // ✅ Make sure this is imported
import User from "../models/userModel.js";
import Notification from "../models/notificationModel.js";
import sendNotification from "../utils/sendNotification.js";

import sendToken from "../utils/jwtToken.js";
import crypto from "crypto";
import cloudinary from "cloudinary";
import mongoose from "mongoose"; // ES6 import
import Role from "../models/roleModel.js";
import bcrypt from "bcrypt";
import sendEmail from "../utils/sendEmail.js"; // अगर sendEmail function u
import { formatUser } from "../utils/formatUser.js";


export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("role");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: formatUser(user),
    });
  } catch (err) {
    console.error("❌ Get User Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const cookieRefreshToken = req.cookies?.refreshToken;

    if (!cookieRefreshToken) {
      return res.status(401).json({
        success: false,
        message: "No refresh token found",
      });
    }

    // 1️⃣ Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(
        cookieRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
    } catch (err) {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    // 2️⃣ Find user
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(403).json({
        success: false,
        message: "User not valid",
      });
    }

    // 3️⃣ Hash incoming token
    const hashedIncomingToken = crypto
      .createHash("sha256")
      .update(cookieRefreshToken)
      .digest("hex");

    // 4️⃣ Compare with DB
    if (user.refreshToken !== hashedIncomingToken) {
      return res.status(403).json({
        success: false,
        message: "Session invalid or token reused",
      });
    }

    // 5️⃣ Issue new tokens (rotation handled in sendToken)
    return sendToken(user, 200, res);

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getActiveUsers = async (req, res) => {
  try {
    const users = await User.find(); // all users
    const currentUserId = req.user?.id;

    const activeUsers = users.filter(
      (user) => user.isActive || user._id.toString() === currentUserId
    );
    const blockedUsers = users.filter((user) => user.isBlocked);

    // Mark current user
    const usersWithCurrentFlag = users.map((user) => ({
      ...user.toObject(),
      currentUser: user._id.toString() === currentUserId,
    }));

    res.status(200).json({
      success: true,
      totalUsers: users.length,
      activeUsers: activeUsers.length,
      blockedUsers: blockedUsers.length,
      users: usersWithCurrentFlag,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getUploadSignature = (req, res) => {
  try {
    const timestamp = Math.round(Date.now() / 1000);
    const signature = cloudinary.v2.utils.api_sign_request(
      { timestamp, folder: "avatars" },
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({
      success: true,
      signature,
      timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      folder: "avatars",
    });
  } catch (err) {
    console.error("❌ Signature Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;

    const normalizedEmail = email?.toLowerCase().trim();

    // ✅ Validate fields
    if (!name || !normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    // ✅ Check existing user
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // ============================================
    // ✅ ROLE LOGIC
    // ============================================

    const adminRole = await Role.findOne({ role_key: "admin" });
    const userRole = await Role.findOne({ role_key: "user" });

    let roleId;

    if (
      process.env.ADMIN_EMAIL &&
      normalizedEmail === process.env.ADMIN_EMAIL.toLowerCase().trim()
    ) {
      roleId = adminRole?._id;
    } else {
      roleId = userRole?._id;
    }

    if (!roleId) {
      return res.status(500).json({
        success: false,
        message: "Role not found in DB",
      });
    }

    // ============================================
    // ✅ CREATE USER
    // ============================================

    let user = await User.create({
      name,
      email: normalizedEmail,
      password,
      role: roleId,
      avatar: avatar
        ? { url: avatar.url, public_id: avatar.public_id }
        : {
            url: "https://via.placeholder.com/150?text=No+Avatar",
            public_id: null,
          },
    });

    // ✅ Populate role for response
    user = await user.populate("role");

    // ============================================
    // ✅ NOTIFICATION
    // ============================================

    const io = req.app.get("io");

    await sendNotification({
      io,
      userId: user._id,
      type: "alert",
      title: "Welcome!",
      message: "Your account has been successfully created.",
    });

    // ============================================
    // ✅ SEND CLEAN RESPONSE (NO TOKEN)
    // ============================================

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
          ? {
              id: user.role._id,
              name: user.role.role_name,
              key: user.role.role_key,
            }
          : null,
        avatar: user.avatar?.url || null,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    });

  } catch (err) {
    console.error("❌ Register Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Validate fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter Email & Password",
      });
    }

    // ✅ Find user with password
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ✅ Compare password
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ============================================
    // ✅ UNIVERSAL LOGIN NOTIFICATION
    // ============================================

    const io = req.app.get("io");

    await sendNotification({
      io,
      userId: user._id,
      type: "alert",
      title: "Login Successful",
      message: "A new login to your account was detected.",
    });

    // ✅ Send token + response
    sendToken(user, 200, res, "Login successful");
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



export const logout = async (req, res) => {
  try {
    const isProd = process.env.NODE_ENV === "production";

    // 🔹 1️⃣ Get refresh token from cookie
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      try {
        // 🔹 2️⃣ Verify refresh token
        const decoded = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );

        // 🔹 3️⃣ Find user & clear refresh token from DB
        const user = await User.findById(decoded.id);
        if (user) {
          await user.clearRefreshToken(); // ✅ model method
        }
      } catch (err) {
        // ❌ Invalid / expired refresh token → ignore
      }
    }

    // 🔹 4️⃣ Clear cookies (always)
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "None" : "Lax",
      path: "/",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "None" : "Lax",
      path: "/",
    });

    // 🔹 5️⃣ Response
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("❌ Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};


export const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get(
      "host"
    )}/password/reset/${resetToken}`;
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

    try {
      await sendEmail({
        email: user.email,
        subject: `Ecommerce Password Recovery`,
        message,
      });
      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
        resetToken,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Reset Password Token is invalid or has expired",
      });
    }

    const { password, confirmPassword } = req.body;
    if (!password || !confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide both passwords" });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password has been reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    if (!isPasswordMatched) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    user.password = req.body.newPassword;
    await user.save();

    // ============================================
    // ✅ UNIVERSAL PASSWORD UPDATE NOTIFICATION
    // ============================================

    const io = req.app.get("io");

    await sendNotification({
      io,
      userId: user._id,
      type: "alert",
      title: "Password Updated",
      message: "Your account password was changed successfully.",
    });

    // ✅ Send token
    sendToken(user, 200, res, "Password updated successfully");
  } catch (err) {
    console.error("❌ Update Password Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const { name, email, avatar } = req.body; // avatar = { url, public_id }

    // ✅ Auth middleware से req.user.id आना चाहिए
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // ✅ Email update check (case insensitive)
    if (email && email.toLowerCase().trim() !== user.email) {
      const existingUser = await User.findOne({
        email: email.toLowerCase().trim(),
      });
      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: "Email already in use" });
      }
      user.email = email.toLowerCase().trim();
    }

    // ✅ Name update
    if (name) user.name = name.trim();

    // ✅ Avatar update
    if (avatar && avatar.url && avatar.public_id) {
      // पुराना avatar delete करो अगर है तो
      if (user.avatar?.public_id) {
        try {
          await cloudinary.v2.uploader.destroy(user.avatar.public_id);
        } catch (err) {
          console.warn("⚠️ Failed to delete old avatar:", err.message);
        }
      }
      user.avatar = { url: avatar.url, public_id: avatar.public_id };
    }

    await user.save();

    // ✅ Success response (अगर JWT payload में info है तो नया token भेजो)
    sendToken(user, 200, res, "Profile updated successfully");
  } catch (err) {
    console.error("❌ UpdateProfile Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: err.message,
    });
  }
};



export const getAllUsers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const users = await User.find()
      .select("-LoginPassword")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalUsers = await User.countDocuments();

    res.json({
      success: true,
      users,
      totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const updateUserRole = async (req, res) => {
  try {
    const { roleId } = req.body;
    const { id } = req.params;

    if (!roleId) {
      return res.status(400).json({
        success: false,
        message: "roleId is required",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // optional safety: prevent admin role assignment if needed
    // (remove this if you don't have admin restriction anymore)
    // if (roleId === ADMIN_ROLE_ID) {}

    user.role = roleId; // ✅ ONLY STORE ROLE REFERENCE

    await user.save();

    res.json({
      success: true,
      message: "Role updated successfully",
      user,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Check user exist
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 🔒 Admin ko delete hone se bachao
    if (user.Roll_ID === 1) {
      return res.status(403).json({
        success: false,
        message: "Admin cannot be deleted",
      });
    }

    // ✅ Delete
    await User.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};



function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

export const searchUsers = async (req, res) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query required" });
    }

    const orFilters = [];

    // 1️⃣ ObjectId search
    if (mongoose.Types.ObjectId.isValid(query)) {
      orFilters.push({ _id: query });
    }

    // 2️⃣ Date search (dd/mm/yyyy)
    const dateMatch = query.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (dateMatch) {
      const day = parseInt(dateMatch[1], 10);
      const month = parseInt(dateMatch[2], 10) - 1;
      const year = parseInt(dateMatch[3], 10);

      const start = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
      const end = new Date(Date.UTC(year, month, day, 23, 59, 59, 999));

      orFilters.push({ createdAt: { $gte: start, $lte: end } });
    }

    // 3️⃣ Regex search (safe)
    const escapedQuery = escapeRegex(query);
    const regex = new RegExp(escapedQuery, "i");

    orFilters.push({ name: { $regex: regex } });
    orFilters.push({ email: { $regex: regex } });
    orFilters.push({ LoginID: { $regex: regex } });

    // 4️⃣ Final Query
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find({ $or: orFilters })
        .select("-password -refreshToken -resetPasswordToken -resetPasswordExpire")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),

      User.countDocuments({ $or: orFilters }),
    ]);

    // 5️⃣ Response
    res.status(200).json({
      success: true,
      totalUsers: total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      users,
    });
  } catch (err) {
    console.error("Search Users Error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Server Error",
    });
  }
};