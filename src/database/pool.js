import pg from 'pg';

const { Pool } = pg;

const isSslEnabled = String(process.env.DB_SSL ?? 'false').toLowerCase() === 'true';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isSslEnabled
    ? {
        rejectUnauthorized: false,
      }
    : false,
});

export async function query(text, params) {
  return pool.query(text, params);
}
