
const User = require("../models/User");
const mongoose = require("mongoose");

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: "active" });
    const inactiveUsers = await User.countDocuments({ status: "inactive" });
    const adminUsers = await User.countDocuments({ role: "admin" });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        adminUsers
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch dashboard statistics" });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch users" });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { name, email, role, status } = req.body;
    const userId = req.params.id;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const allowedRoles = ["user", "admin"];
    const allowedStatuses = ["active", "inactive"];

    // Validate role
    if (role !== undefined && !allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Validate status
    if (status !== undefined && !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Prevent admin from changing their own role or status
    if (userId === req.user._id.toString()) {
      if (role !== undefined && role !== "admin") {
        return res.status(403).json({
          message: "You cannot change your own admin role"
        });
      }

      if (status !== undefined && status !== "active") {
        return res.status(403).json({
          message: "You cannot deactivate your own account"
        });
      }
    }

    const updates = {};

    // Validate name
    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          message: "Name must be a valid non-empty string"
        });
      }

      updates.name = name.trim();
    }

    // Validate email
    if (email !== undefined) {
      if (
        typeof email !== "string" ||
        !email.trim() ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
      ) {
        return res.status(400).json({
          message: "Please provide a valid email address"
        });
      }

      updates.email = email.trim().toLowerCase();
    }

    if (role !== undefined) {
      updates.role = role;
    }

    if (status !== undefined) {
      updates.status = status;
    }

    // Prevent empty updates
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "No valid fields provided for update"
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      {
        new: true,
        runValidators: true
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email already registered"
      });
    }

    res.status(500).json({
      message: "Unable to update user"
    });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Prevent admin from deleting their own account
    if (userId === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot delete your own account"
      });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Unable to delete user"
    });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUser,
  deleteUser
};
