import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Set DATABASE_URL in your .env file to your PostgreSQL connection string
    // Example: postgresql://user:password@host:5432/dbname
    url: process.env["DATABASE_URL"],
  },
});
