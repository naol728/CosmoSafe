import { pgTable, serial, text, timestamp } from "drizzle-orm-pg";

type UserRole = "premium" | "regular" | "admin";

export const user = pgTable("user", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull().$type<UserRole>(),
  created_at: timestamp("created_at").defaultNow(),
  profileimg: text("profileimg"),
});
