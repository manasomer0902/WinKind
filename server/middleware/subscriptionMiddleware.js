import pool from "../config/db.js";

export const requireSubscription = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT status, expiry_date 
       FROM subscriptions 
       WHERE user_id = $1 
       ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({
        message: "No subscription found",
      });
    }

    const sub = result.rows[0];

    // ❌ expired check
    if (
      sub.status !== "active" ||
      new Date(sub.expiry_date) < new Date()
    ) {
      return res.status(403).json({
        message: "Subscription expired",
      });
    }

    next();

  } catch (error) {
    console.error("Subscription middleware error:", error.message);
    res.status(500).json({ message: "Subscription check failed" });
  }
};