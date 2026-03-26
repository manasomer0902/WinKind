import pool from "../config/db.js";
import { generateDrawNumbers, countMatches } from "../utils/drawLogic.js";

/*
  Draw Controller
  ---------------
  Handles:
  - Running actual draw (DB save)
  - Simulating draw (no DB save)
  - Fetching latest draw
*/

// ================= RUN DRAW =================
export const runDraw = async (req, res) => {
  try {
    const drawNumbers = generateDrawNumbers();

    const draw = await pool.query(
      `INSERT INTO draws (draw_date, numbers, status) 
       VALUES (NOW(), $1, 'completed') RETURNING *`,
      [drawNumbers]
    );

    const drawId = draw.rows[0].id;

    // ACTIVE USERS
    const subs = await pool.query(
      `SELECT * FROM subscriptions 
       WHERE status = 'active' AND expiry_date > NOW()`
    );

    const totalUsers = subs.rows.length;
    const totalPool = totalUsers * 100;

    const fiveMatchPool = totalPool * 0.4;
    const fourMatchPool = totalPool * 0.35;
    const threeMatchPool = totalPool * 0.25;

    const winnersData = [];

    const users = await pool.query(`
      SELECT users.id 
      FROM users
      JOIN subscriptions ON users.id = subscriptions.user_id
      WHERE subscriptions.status = 'active'
      AND subscriptions.expiry_date > NOW()
    `);

    for (let user of users.rows) {
      const userId = user.id;

      const scoresRes = await pool.query(
        "SELECT score FROM scores WHERE user_id = $1",
        [userId]
      );

      const userScores = scoresRes.rows.map(s => s.score);

      if (userScores.length < 5) continue;

      const matchCount = countMatches(userScores, drawNumbers);

      if (matchCount >= 3) {
        winnersData.push({ userId, matchCount });
      }
    }

    // GROUP
    const fiveWinners = winnersData.filter(w => w.matchCount === 5);
    const fourWinners = winnersData.filter(w => w.matchCount === 4);
    const threeWinners = winnersData.filter(w => w.matchCount === 3);

    let carryForward = 0;
    if (fiveWinners.length === 0) {
      carryForward = fiveMatchPool;
    }

    const fivePrize = fiveWinners.length ? fiveMatchPool / fiveWinners.length : 0;
    const fourPrize = fourWinners.length ? fourMatchPool / fourWinners.length : 0;
    const threePrize = threeWinners.length ? threeMatchPool / threeWinners.length : 0;

    // SAVE WINNERS
    for (let w of winnersData) {
      let prize = 0;

      if (w.matchCount === 5) prize = fivePrize;
      if (w.matchCount === 4) prize = fourPrize;
      if (w.matchCount === 3) prize = threePrize;

      await pool.query(
        `INSERT INTO winners (user_id, draw_id, match_count, prize_amount, status)
         VALUES ($1, $2, $3, $4, 'pending')`,
        [w.userId, drawId, w.matchCount, prize]
      );
    }

    // SAVE POOL
    await pool.query(
      `INSERT INTO prize_pools 
       (draw_id, total_pool, five_match_pool, four_match_pool, three_match_pool, jackpot_carry_forward)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [drawId, totalPool, fiveMatchPool, fourMatchPool, threeMatchPool, carryForward]
    );

    res.json({
      message: "Draw completed",
      drawNumbers,
      totalUsers,
      totalPool,
      carryForward,
    });

  } catch (error) {
    console.error("runDraw error:", error.message);
    res.status(500).json({ message: "Error running draw" });
  }
};

// ================= SIMULATE DRAW =================
export const simulateDraw = async (req, res) => {
  try {
    const drawNumbers = generateDrawNumbers();

    res.json({
      message: "Simulation only (no DB save)",
      drawNumbers,
    });

  } catch (error) {
    console.error("simulateDraw error:", error.message);
    res.status(500).json({ message: "Simulation failed" });
  }
};

// ================= GET LATEST DRAW =================
export const getLatestDraw = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM draws ORDER BY created_at DESC LIMIT 1`
    );

    res.json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ message: "Error fetching draw" });
  }
};