import express from "express";
import {
  addScore,
  deleteScore,
  getScores,
  updateScore,
} from "../controllers/scoreController.js";

import { protect } from "../middleware/authMiddleware.js";
import { requireSubscription } from "../middleware/subscriptionMiddleware.js";

/*
  Score Routes
  ------------
  Handles:
  - Adding user scores
  - Fetching latest scores

  Rules:
  - Adding score → requires active subscription
  - Fetching scores → only requires login
*/

const router = express.Router();

// ================= SCORE =================

// Add new score (subscription required)
router.post("/add", protect, requireSubscription, addScore);

// Get user scores (latest first)
router.get("/get-scores", protect, getScores);

// Update user score
router.put("/:id", protect, updateScore);

// Delete user score
router.delete("/:id", protect, deleteScore);

export default router;