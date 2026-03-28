import pool from "../config/db.js";

/*
  Admin Controller (Production Ready)
*/

// ================= GET ALL USERS =================
export const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role FROM users ORDER BY id DESC LIMIT 50"
    );

    res.json(result.rows);

  } catch (error) {
    console.error("getAllUsers error:", error.message);

    res.status(500).json({
      message: "Server error while fetching users",
    });
  }
};

// ================= UPDATE USER ROLE =================
export const updateUserRole = async (req, res) => {
  try {
    const user_id = req.params.id;   
    const { role } = req.body;

    if (!user_id || !role) {
      return res.status(400).json({
        message: "User ID and role required",
      });
    }

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const userCheck = await pool.query(
      "SELECT id, role FROM users WHERE id = $1",
      [user_id]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 🔒 Prevent self demotion
    if (req.user.id === user_id && role !== "admin") {   
      return res.status(400).json({
        message: "You cannot remove your own admin access",
      });
    }

    const updated = await pool.query(
      `UPDATE users 
       SET role = $1 
       WHERE id = $2 
       RETURNING id, name, email, role`,
      [role, user_id]
    );

    if (!updated.rows[0]) {
      return res.status(500).json({
        message: "Update failed",
      });
    }

    res.json({
      message: "Role updated successfully",
      user: updated.rows[0],
    });

  } catch (error) {
    console.error("updateUserRole error:", error.message);

    res.status(500).json({
      message: "Server error while updating role",
    });
  }
};

// ================= ADMIN STATS =================
export const getAdminStats = async (req, res) => {
  try {
    const users = await pool.query(
      "SELECT COUNT(*) FROM users WHERE role = 'user'"
    );

    const winners = await pool.query(
      "SELECT COUNT(*) FROM winners"
    );

    const subs = await pool.query(
      "SELECT COUNT(*) FROM subscriptions"
    );

    res.json({
      totalUsers: Number(users.rows[0].count),
      totalWinners: Number(winners.rows[0].count),
      totalSubscriptions: Number(subs.rows[0].count),
    });

  } catch (error) {
    console.error("getAdminStats error:", error.message);

    res.status(500).json({
      message: "Stats error",
    });
  }
};