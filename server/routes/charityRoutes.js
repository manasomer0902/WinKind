import express from "express";
import {
  addCharity,
  getCharities,
  selectCharity,
  getUserCharity,
  deleteCharity,
} from "../controllers/charityController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

/*
  Charity Routes
  --------------
  Handles:
  - Admin: add charities
  - Public: view charities
  - User: select charity & view selection
*/

const router = express.Router();

// ================= ADMIN =================

// Add new charity
router.post("/add", protect, adminOnly, addCharity);

// ================= PUBLIC =================

// Get all charities
router.get("/", getCharities);

// ================= USER =================

// Select charity (with contribution %)
router.post("/select", protect, selectCharity);

// Get user's selected charity
router.get("/my", protect, getUserCharity);

router.delete("/:id", protect, adminOnly, deleteCharity);

export default router;