import "dotenv/config"
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL not found in .env");
}

// for query purposes
const queryClient = postgres(process.env.DATABASE_URL!);
const db = drizzle(queryClient);


export default db;
