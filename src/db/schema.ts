import { sql } from "drizzle-orm";
import {
  pgTable,
  integer,
  text,
  jsonb,
  serial,
  timestamp,
  bigint,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

const advocates = pgTable("advocates", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  city: text("city").notNull(),
  degree: text("degree").notNull(),
  specialties: jsonb("payload").default([]).notNull(),
  yearsOfExperience: integer("years_of_experience").notNull(),
  phoneNumber: bigint("phone_number", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export { advocates };

export const advocateSchema = createSelectSchema(advocates)
    .extend({
      phoneNumber: z.coerce.string().min(10)
          .transform(val => `(${val.slice(0, 3)}) ${val.slice(3, 6)}-${val.slice(6)}`),
      specialties: z.array(z.string()),
      createdAt: z.string(),
    });

export type Advocate = z.infer<typeof advocateSchema>;