import pool from "../config/db.js";

/*
  Subscription Middleware (Production Ready)
  -----------------------------------------
  - Validates active subscription
  - Handles timezone safely
  - Attaches subscription to req
*/

export const requireSubscription = async (req, res, next) => {
  try {
    // ❌ Safety check
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Unauthorized: user not found",
      });
    }

    const userId = req.user.id;

    const result = await pool.query(
      `SELECT status, expiry_date 
       FROM subscriptions 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [userId]
    );

    // 🔴 No subscription
    if (result.rows.length === 0) {
      return res.status(403).json({
        message: "No active subscription",
      });
    }

    const sub = result.rows[0];

    const now = new Date();
    const expiry = new Date(sub.expiry_date);

    // 🔥 Normalize (avoid timezone issues)
    now.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);

    // ❌ Expired or inactive
    if (sub.status !== "active" || expiry < now) {
      return res.status(403).json({
        message: "Subscription expired",
      });
    }

    // ✅ Attach subscription for later use
    req.subscription = sub;

    next();

  } catch (error) {
    console.error("Subscription middleware error:", error.message);

    return res.status(500).json({
      message: "Subscription check failed",
    });
  }
};