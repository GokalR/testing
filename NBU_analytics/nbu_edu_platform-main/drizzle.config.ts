import { defineConfig } from "drizzle-kit";
import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env.local manually since drizzle-kit does not read it automatically
try {
  const envFile = readFileSync(resolve(process.cwd(), ".env.local"), "utf-8");
  for (const line of envFile.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
} catch {
  // .env.local may not exist in production/CI — ignore
}

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
