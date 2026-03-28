import pool from "../config/db.js";

/*
  User Controller (Production Ready)
*/

// ================= GET PROFILE =================
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error("getProfile error:", err.message);

    res.status(500).json({
      message: "Server error while fetching profile",
    });
  }
};

// ================= UPDATE PROFILE =================
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    let { name } = req.body;

    // 🔴 Validation
    if (typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({
        message: "Valid name is required",
      });
    }

    name = name.trim();

    const currentUser = await pool.query(
      "SELECT name FROM users WHERE id = $1",
      [userId]
    );

    if (currentUser.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (
      currentUser.rows[0].name.toLowerCase() === name.toLowerCase()
    ) {
      return res.json({
        message: "No changes detected",
      });
    }

    const result = await pool.query(
      `UPDATE users 
       SET name = $1 
       WHERE id = $2 
       RETURNING id, name, email, role`,
      [name, userId]
    );

    res.json({
      message: "Profile updated successfully",
      user: result.rows[0],
    });

  } catch (err) {
    console.error("updateProfile error:", err.message);

    res.status(500).json({
      message: "Server error while updating profile",
    });
  }
};