import pool from "../config/db.js";

/*
  Winner Controller
  -----------------
  Handles:
  - Upload proof (user)
  - Verify winner (admin)
  - Fetch all winners (admin)
*/

// ================= UPLOAD PROOF =================
export const uploadProof = async (req, res) => {
  try {
    const userId = req.user.id;
    const winnerId = req.params.id;

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const filePath = req.file.filename;

    const result = await pool.query(
      `UPDATE winners 
       SET proof = $1 
       WHERE id = $2 AND user_id = $3
       RETURNING *`,
      [filePath, winnerId, userId]
    );

    res.json({
      message: "Proof uploaded",
      data: result.rows[0],
    });

  } catch (err) {
    console.error("uploadProof error:", err.message);
    res.status(500).json({ message: "Upload failed" });
  }
};

// ================= VERIFY WINNER =================
export const verifyWinner = async (req, res) => {
  try {
    const { winner_id, status } = req.body;

    // 🔴 Validation
    if (!winner_id || !status) {
      return res.status(400).json({
        message: "Winner ID and status are required",
      });
    }

    // 🔴 Only allow valid statuses
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const result = await pool.query(
      `UPDATE winners 
       SET status = $1 
       WHERE id = $2
       RETURNING id`,
      [status, winner_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Winner not found",
      });
    }

    res.json({
      message: `Winner ${status} successfully`,
    });

  } catch (error) {
    console.error("verifyWinner error:", error.message);

    res.status(500).json({
      message: "Server error while verifying winner",
    });
  }
};

// ================= GET ALL WINNERS =================
export const getAllWinners = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, user_id, draw_id, match_count, prize_amount, status, proof, created_at
       FROM winners
       ORDER BY created_at DESC`
    );

    res.json(result.rows);

  } catch (error) {
    console.error("getAllWinners error:", error.message);

    res.status(500).json({
      message: "Server error while fetching winners",
    });
  }
};

export const getUserWinnings = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      "SELECT * FROM winners WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    res.json(result.rows); // ✅ IMPORTANT: always array
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching winnings" });
  }
};