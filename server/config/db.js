import pkg from "pg";
const { Pool } = pkg;

/*
  Database Config
  ---------------
  - Works for both local & production
  - Uses SSL only in production
*/

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  ssl: isProduction
    ? { rejectUnauthorized: false }
    : false,
});

export default pool;