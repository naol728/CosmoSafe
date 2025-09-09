import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  doublePrecision,
  integer,
  uuid,
  jsonb,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull(),
  is_premium: boolean("is_premium").default(false),
  is_admin: boolean("is_admin").default(false),
  created_at: timestamp("created_at").defaultNow(),
});

export const earthquakes = pgTable("earthquakes", {
  id: text("id").primaryKey().notNull(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  magnitude: doublePrecision("magnitude").notNull(),
  place: text("place").notNull(),
  time: timestamp("time").notNull(),
  depth: doublePrecision("depth").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  url: text("url").notNull(),
});
export const disasters = pgTable("disasters", {
  id: text("id").primaryKey(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  link: text("link").notNull(),
  categories: jsonb("categories").notNull(),
  sources: jsonb("sources").notNull(),
  geometry: jsonb("geometry").notNull(),
  closed: boolean("closed").default(false),
  created_at: timestamp("created_at").defaultNow(),
});
