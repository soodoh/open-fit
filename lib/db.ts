"use server";

import { Pool } from "pg";

let db: Pool | null = null;

if (!db) {
  db = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT ?? "5432", 10),
    database: process.env.POSTGRES_DB,
  });
}

export default db as Pool;
