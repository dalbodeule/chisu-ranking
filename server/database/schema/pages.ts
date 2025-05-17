import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import Users from "./users";
import { sql } from "drizzle-orm";

const pages = sqliteTable("pages", {
  id: int("id").primaryKey({ autoIncrement: true }),
  userId: text("userId").references(() => Users.userId),
  pagename: text("contentId", { length: 64 }),
  content: text("content"),
  created_at: int("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(STRFTIME('%s'))`),
  updated_at: int("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(STRFTIME('%s'))`),
});

export default pages;
