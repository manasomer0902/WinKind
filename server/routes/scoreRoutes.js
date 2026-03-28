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
  Base: /api/score

  Rules:
  - Add / Update / Delete → requires active subscription
  - Get → only requires login
*/

const router = express.Router();

// ================= SCORE =================

// Add new score
router.post("/", protect, requireSubscription, addScore);

// Get user scores
router.get("/", protect, getScores);

// Update score
router.put("/:id", protect, requireSubscription, updateScore);

// Delete score
router.delete("/:id", protect, requireSubscription, deleteScore);

export default router;