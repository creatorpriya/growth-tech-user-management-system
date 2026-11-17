
const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  getAllUsers,
  updateUser,
  deleteUser
} = require("../controllers/userController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

// All routes below require admin authentication
router.use(protect, adminOnly);

// Dashboard statistics
router.get("/stats", getDashboardStats);

// Get all users
router.get("/", getAllUsers);

// Update user
router.put("/:id", updateUser);

// Delete user
router.delete("/:id", deleteUser);

module.exports = router;
