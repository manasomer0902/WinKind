import pkg from "pg";
const { Pool } = pkg;

/*
  FINAL STABLE DB CONFIG
*/

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined ❌");
}

// 🔥 IMPORTANT FIX (SSL issue resolve)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  ssl: {
    rejectUnauthorized: false,
  },

  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// ✅ Test DB connection
pool.connect()
  .then(() => console.log("Database connected successfully ✅"))
  .catch((err) => {
    console.error("Database connection error ❌", err);
    process.exit(1);
  });

export default pool;