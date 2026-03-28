import express from "express";
import {
  getProfile,
  updateProfile,
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";

/*
  User Routes
  -----------
  Base: /api/user

  Handles:
  - Fetch logged-in user profile
  - Update profile

  All routes require authentication
*/

const router = express.Router();

// ================= PROFILE =================

// Modern route (recommended)
router.get("/me", protect, getProfile);
router.put("/me", protect, updateProfile);

// Optional: backward compatibility
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

export default router;