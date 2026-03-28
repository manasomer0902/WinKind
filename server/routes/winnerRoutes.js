import express from "express";
import {
  uploadProof,
  verifyWinner,
  getAllWinners,
  getUserWinnings,
} from "../controllers/winnerController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { requireSubscription } from "../middleware/subscriptionMiddleware.js";

/*
  Winner Routes
  -------------
  Base: /api/winner

  Handles:
  - User proof upload
  - Admin verification
  - Fetch winners
*/

const router = express.Router();

// ================= USER =================

// Upload proof
router.post(
  "/:id/proof",
  protect,
  requireSubscription,
  upload.single("proof"),
  uploadProof
);

// Get user's winnings
router.get("/me", protect, getUserWinnings);

// ================= ADMIN =================

// Verify winner (approve/reject)
router.put("/:id", protect, adminOnly, verifyWinner);

// Get all winners
router.get("/", protect, adminOnly, getAllWinners);

export default router;