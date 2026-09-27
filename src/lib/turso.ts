import { createClient } from "@libsql/client";

const url =
  process.env.TURSO_DATABASE_URL ||
  "libsql://basedex-basedex.aws-ap-south-1.turso.io";

const authToken =
  process.env.TURSO_AUTH_TOKEN ||
  "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTA1Mjg1MTIsImlkIjoiMDFhMGUzZDAtYTQwMS03NmE2LThiMDgtNzBkN2EzMDdjYzNhIiwia2lkIjoiWmZtSmpwUy1JSjl5ZXdZajFvNDZJZVBEOFE3UXJJSF95U2kxOGpWNUY4ayIsInJpZCI6ImZhMzllMjkzLWMxYzEtNDA1Yy1hMGZhLTRhY2MzMmIzZDNiNCJ9.EDVxTOELN9XgzqywXy2j2_OQnlaUVbLrNj7IA1j64TS_qTGxyLL4BVG4iKtvpLEPC4RbCN99gv2qm6lns4sKBw";

export const turso = createClient({
  url,
  authToken,
});

export async function initDb() {
  await turso.execute(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tx_hash TEXT UNIQUE NOT NULL,
      user_address TEXT NOT NULL,
      token_in_symbol TEXT NOT NULL,
      token_in_address TEXT NOT NULL,
      token_in_amount TEXT NOT NULL,
      token_in_usd REAL DEFAULT 0,
      token_out_symbol TEXT NOT NULL,
      token_out_address TEXT NOT NULL,
      token_out_amount TEXT NOT NULL,
      token_out_usd REAL DEFAULT 0,
      timestamp INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await turso.execute(`
    CREATE INDEX IF NOT EXISTS idx_user_address ON transactions(user_address);
  `);
  await turso.execute(`
    CREATE INDEX IF NOT EXISTS idx_timestamp ON transactions(timestamp DESC);
  `);
}
