import express from "express";
import {
  runDraw,
  simulateDraw,
  getLatestDraw,
} from "../controllers/drawController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { requireSubscription } from "../middleware/subscriptionMiddleware.js";

/*
  Draw Routes
  -----------
  Handles:
  - Running actual draw (DB save)
  - Simulating draw (no DB save)
  - Fetching latest draw

  Rules:
  - Admin routes → protected + adminOnly
  - User routes → protected
*/

const router = express.Router();

// ================= ADMIN =================

// Run actual draw (saved in DB)
router.post("/run", protect, adminOnly, runDraw);

// Simulate draw (no DB save)
router.post("/simulate", protect, adminOnly, simulateDraw);


// Get latest draw results
router.get("/latest", protect, requireSubscription, getLatestDraw);

export default router;