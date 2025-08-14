import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import path from "node:path";
import { defineConfig } from "prisma/config";

dotenvExpand.expand(dotenv.config());

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("db", "migrations"),
    seed: "tsx prisma/seed.ts",
  },
});
