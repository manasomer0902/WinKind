import pool from "../config/db.js";
import { generateDrawNumbers, countMatches } from "../utils/drawLogic.js";

/*
  Draw Controller
  ---------------
*/

// ================= RUN DRAW =================
export const runDraw = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const drawNumbers = generateDrawNumbers();

    const draw = await client.query(
      `INSERT INTO draws (draw_date, numbers, status) 
       VALUES (NOW(), $1, 'completed') RETURNING *`,
      [drawNumbers]
    );

    const drawId = draw.rows[0].id;

    // 🟢 Fetch users + scores
    const users = await client.query(`
      SELECT u.id, array_agg(s.score) AS scores
      FROM users u
      JOIN subscriptions sub ON u.id = sub.user_id
      LEFT JOIN scores s ON u.id = s.user_id
      WHERE sub.status = 'active' AND sub.expiry_date > NOW()
      GROUP BY u.id
    `);

    const winnersData = [];

    for (let user of users.rows) {
      const userScores = user.scores?.filter(Boolean) || [];

      if (userScores.length < 5) continue;

      const matchCount = countMatches(userScores, drawNumbers);

      if (matchCount >= 3) {
        winnersData.push({ userId: user.id, matchCount });
      }
    }

    // 🟢 Pool calculation
    const totalUsers = users.rows.length;
    const totalPool = totalUsers * 100;

    const fivePool = totalPool * 0.4;
    const fourPool = totalPool * 0.35;
    const threePool = totalPool * 0.25;

    const fiveWinners = winnersData.filter(w => w.matchCount === 5);
    const fourWinners = winnersData.filter(w => w.matchCount === 4);
    const threeWinners = winnersData.filter(w => w.matchCount === 3);

    let carryForward = fiveWinners.length === 0 ? fivePool : 0;

    const fivePrize = fiveWinners.length
      ? Math.round(fivePool / fiveWinners.length)
      : 0;

    const fourPrize = fourWinners.length
      ? Math.round(fourPool / fourWinners.length)
      : 0;

    const threePrize = threeWinners.length
      ? Math.round(threePool / threeWinners.length)
      : 0;

    // 🟢 Save winners
    for (let w of winnersData) {
      let prize = 0;

      if (w.matchCount === 5) prize = fivePrize;
      if (w.matchCount === 4) prize = fourPrize;
      if (w.matchCount === 3) prize = threePrize;

      await client.query(
        `INSERT INTO winners (user_id, draw_id, match_count, prize_amount, status)
         VALUES ($1, $2, $3, $4, 'pending')`,
        [w.userId, drawId, w.matchCount, prize]
      );
    }

    // 🟢 Save pool
    await client.query(
      `INSERT INTO prize_pools 
       (draw_id, total_pool, five_match_pool, four_match_pool, three_match_pool, jackpot_carry_forward)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [drawId, totalPool, fivePool, fourPool, threePool, carryForward]
    );

    await client.query("COMMIT");

    res.json({
      message: "Draw completed successfully",
      drawNumbers,
      totalUsers,
      totalPool,
      carryForward,
    });

  } catch (error) {
    await client.query("ROLLBACK");

    console.error("runDraw error:", error.message);
    res.status(500).json({ message: "Error running draw" });

  } finally {
    client.release();
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
      `SELECT * FROM draws ORDER BY created_at DESC LIMIT 1` // 
    );

    if (result.rows.length === 0) {
      return res.json(null);
    }

    res.json(result.rows[0] || null); 

  } catch (error) {
    console.error("getLatestDraw error:", error.message);
    res.status(500).json({ message: "Error fetching draw" });
  }
};