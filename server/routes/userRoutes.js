import express from "express";
import {
  getProfile,
  updateProfile,
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";

/*
  User Routes
  -----------
  Handles:
  - Fetching logged-in user profile
  - Updating user profile

  All routes require authentication
*/

const router = express.Router();

// ================= PROFILE =================

// Get profile
router.get("/profile", protect, getProfile);

// Update profile
router.put("/profile", protect, updateProfile);

export default router;