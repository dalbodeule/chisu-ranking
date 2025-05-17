import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

const users = sqliteTable("users", {
  userId: text("userId", { length: 32 }).notNull().primaryKey(),
  name: text("name", { length: 80 }).notNull(),
  created_at: int("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(STRFTIME('%s'))`),
  updated_at: int("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(STRFTIME('%s'))`),
});

export default users;
