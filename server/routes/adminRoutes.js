import express from "express";
import {
  getAllUsers,
  updateUserRole,
  getAdminStats,
} from "../controllers/adminController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

/*
  Admin Routes
  ------------
  Handles:
  - User management
  - Role updates

  All routes are:
  - Protected (JWT required)
  - Admin only
*/

const router = express.Router();

// ================= USER MANAGEMENT =================

// Get all users
router.get("/users", protect, adminOnly, getAllUsers);

// Update user role (user ↔ admin)
router.put("/role", protect, adminOnly, updateUserRole);

router.get("/stats", protect, adminOnly, getAdminStats);

export default router;