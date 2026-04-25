import Role from "../models/roleModel.js";
import mongoose from "mongoose";

// ✅ regex (only letters + space)
const nameRegex = /^[A-Za-z\s]+$/;

// 🔥 generate stable key
const generateKey = (name) => {
  return name.toLowerCase().trim().replace(/\s+/g, "_");
};

// ================= CREATE ROLE =================
export const createRole = async (req, res) => {
  try {
    let { role_name } = req.body;

    // ❌ frontend se key lena allow nahi
    if (req.body.role_key) {
      return res.status(400).json({
        success: false,
        message: "role_key cannot be set manually",
      });
    }

    // ✅ required
    if (!role_name || !role_name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Role name is required",
      });
    }

    role_name = role_name.trim();

    // ✅ no special chars
    if (!nameRegex.test(role_name)) {
      return res.status(400).json({
        success: false,
        message: "Only letters and spaces allowed",
      });
    }

    // 🔥 generate key
    const role_key = generateKey(role_name);

    // ✅ duplicate check (name + key)
    const existingRole = await Role.findOne({
      $or: [
        { role_name: { $regex: `^${role_name}$`, $options: "i" } },
        { role_key },
      ],
    });

    if (existingRole) {
      return res.status(400).json({
        success: false,
        message: "Role already exists",
      });
    }

    // ✅ create role
    const role = await Role.create({
      role_name,
      role_key,
    });

    res.status(201).json({
      success: true,
      message: "Role created successfully",
      role,
    });

  } catch (err) {
    console.error("Create Role Error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};
// ================= GET ALL ROLES =================
export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: roles.length,
      roles,
    });
  } catch (err) {
    console.error("Get Roles Error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};

// ================= GET SINGLE ROLE =================
export const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ ID validation
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Role ID",
      });
    }

    const role = await Role.findById(id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    res.status(200).json({
      success: true,
      role,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};
export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    let { role_name } = req.body;

    // ❌ role_key update block
    if (req.body.role_key) {
      return res.status(400).json({
        success: false,
        message: "role_key cannot be updated",
      });
    }

    // ❌ ID validation
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Role ID",
      });
    }

    const role = await Role.findById(id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    // ❌ required check
    if (!role_name || !role_name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Role name is required",
      });
    }

    // 👉 RAW INPUT (NO CASE CHANGE)
    role_name = role_name.trim();

    // ❌ regex validation (letters + spaces only)
    if (!nameRegex.test(role_name)) {
      return res.status(400).json({
        success: false,
        message: "Only letters and spaces allowed",
      });
    }

    // ❌ same name check
    if (role_name === role.role_name) {
      return res.status(400).json({
        success: false,
        message: "New role name must be different",
      });
    }

    // ❌ duplicate check (case-insensitive safe)
    const existing = await Role.findOne({
      role_name: { $regex: `^${role_name}$`, $options: "i" },
      _id: { $ne: id }, // 👈 avoid self-match bug
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Role already exists",
      });
    }

    // 🔥 FINAL SAVE (EXACT ADMIN VALUE)
    role.role_name = role_name;

    await role.save();

    return res.status(200).json({
      success: true,
      message: "Role updated successfully",
      role,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};
// ================= DELETE ROLE =================
export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ ID validation
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Role ID",
      });
    }

    const role = await Role.findByIdAndDelete(id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Role deleted successfully",
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};