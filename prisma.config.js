import { defineConfig, env } from "prisma/config";
const dotenv = require("dotenv")

dotenv.config()

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
