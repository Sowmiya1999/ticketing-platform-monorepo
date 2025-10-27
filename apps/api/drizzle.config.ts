import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/database/schema.ts",  // path to your schema file
  out: "./drizzle",                    // where migrations will be stored
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,    // use your env variable
  },
});
