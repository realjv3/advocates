import "dotenv/config";

if (!("DATABASE_URL" in process.env))
  throw new Error("DATABASE_URL not found in .env");

const config = {
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
};

export default config;
