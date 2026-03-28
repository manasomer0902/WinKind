import pool from "../config/db.js";

/*
  Winner Controller
*/

// ================= UPLOAD PROOF =================
export const uploadProof = async (req, res) => {
  try {
    console.log("USER:", req.user);
    
    const userId = req.user.id;
    const winnerId = req.params.id; 

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const existing = await pool.query(
      "SELECT proof FROM winners WHERE id = $1 AND user_id = $2",
      [winnerId, userId]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        message: "Winner record not found",
      });
    }

    if (existing.rows[0].proof) {
      return res.status(400).json({
        message: "Proof already submitted",
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
      message: "Proof uploaded successfully",
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
    const winner_id = req.params.id; 
    const { status } = req.body;

    if (!winner_id || !status) {
      return res.status(400).json({
        message: "Winner ID and status required",
      });
    }

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const existing = await pool.query(
      "SELECT status FROM winners WHERE id = $1",
      [winner_id]
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({
        message: "Winner not found",
      });
    }

    if (existing.rows[0].status !== "pending") {
      return res.status(400).json({
        message: "Winner already processed",
      });
    }

    const updated = await pool.query(
      "UPDATE winners SET status = $1 WHERE id = $2 RETURNING *",
      [status, winner_id]
    );

    res.json({
      message: `Winner ${status} successfully`, 
      data: updated.rows[0],
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
      `SELECT 
        w.id,
        u.name,
        u.email,
        w.draw_id,
        w.match_count,
        w.prize_amount,
        w.status,
        w.proof,
        w.created_at
       FROM winners w
       JOIN users u ON u.id = w.user_id
       ORDER BY w.created_at DESC`
    );

    res.json(result.rows);

  } catch (error) {
    console.error("getAllWinners error:", error.message);

    res.status(500).json({
      message: "Server error while fetching winners",
    });
  }
};

// ================= GET USER WINNINGS =================
export const getUserWinnings = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      "SELECT * FROM winners WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching winnings" });
  }
};