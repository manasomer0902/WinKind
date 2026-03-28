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
  Base: /api/admin

  All routes:
  - Protected
  - Admin only
*/

const router = express.Router();

// ================= USERS =================

// Get all users
router.get("/users", protect, adminOnly, getAllUsers);

// Update user role
router.put("/users/:id/", protect, adminOnly, updateUserRole);

// ================= STATS =================

router.get("/stats", protect, adminOnly, getAdminStats);

export default router;