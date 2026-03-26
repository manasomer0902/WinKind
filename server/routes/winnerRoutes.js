import express from "express";
import {
  uploadProof,
  verifyWinner,
  getAllWinners,
  getUserWinnings,
} from "../controllers/winnerController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import  upload  from "../middleware/uploadMiddleware.js";
import { requireSubscription } from "../middleware/subscriptionMiddleware.js";

/*
  Winner Routes
  -------------
  Handles:
  - User proof upload
  - Admin verification
  - Admin fetching winners

  Rules:
  - Upload → authenticated user
  - Verify → admin only
  - Fetch winners → admin only
*/

const router = express.Router();

// ================= USER =================

// Upload winning proof (image)
router.post(
  "/upload/:id",
  protect,
  requireSubscription,
  uploadProof
);

router.get("/my", protect, getUserWinnings);

// ================= ADMIN =================

// Verify winner (approve/reject)
router.put("/verify", protect, adminOnly, verifyWinner);

// Get all winners
router.get("/", protect, adminOnly, getAllWinners);

export default router;