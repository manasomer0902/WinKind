import express from "express";
import {
  createOrder,
  verifyPayment,
  getSubscription,
  cancelSubscription,
  getAllSubscriptions,
  updateSubscriptionStatus
} from "../controllers/subscriptionController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

/*
  Subscription Routes
  -------------------
  Base: /api/subscription
*/

const router = express.Router();

// ================= PAYMENT =================
router.post("/create-order", protect, createOrder);  
router.post("/verify-payment", protect, verifyPayment);

// ================= USER =================
router.get("/my", protect, getSubscription);
router.delete("/", protect, cancelSubscription);

// ================= ADMIN =================
router.get("/all", protect, adminOnly, getAllSubscriptions);
router.put("/:id", protect, adminOnly, updateSubscriptionStatus);

export default router;