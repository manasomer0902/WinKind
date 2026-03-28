import pkg from "pg";
const { Pool } = pkg;

/*
  Database Config (Production Ready)
  ---------------------------------
  - Works for both local & production
  - SSL enabled in production
  - Includes safety checks & connection test
*/

const isProduction = process.env.NODE_ENV === "production";

// ❌ Safety check
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined ❌");
}

// ✅ Create pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  ssl: isProduction
    ? { rejectUnauthorized: false }
    : false,

  max: 10, // max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// ✅ Test DB connection on startup
pool.connect()
  .then(() => console.log("Database connected successfully ✅"))
  .catch((err) => {
    console.error("Database connection error ❌", err.message);
    process.exit(1); // stop server if DB fails
  });

export default pool;