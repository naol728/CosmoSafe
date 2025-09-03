import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env.local") });

import { parse } from "pg-connection-string";

const dbUrl = process.env.DATABASE_URL!;
const parsed = parse(dbUrl);

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  strict: true,
  dbCredentials: {
    host: parsed.host ?? "",
    port: parsed.port ? Number(parsed.port) : undefined,
    user: parsed.user ?? "",
    password: parsed.password ?? "",
    database: parsed.database ?? "",
    ssl: { rejectUnauthorized: false },
  },
});
