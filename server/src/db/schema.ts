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
  varchar,
  numeric,
  real,
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

export const collisionAlerts = pgTable("collision_alerts", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  cdmId: varchar("cdm_id", { length: 50 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  emergencyReportable: boolean("emergency_reportable").notNull(),
  minRangeKm: integer("min_range_km").notNull(),
  probability: numeric("probability", { precision: 12, scale: 10 }),
  sat1Id: varchar("sat1_id", { length: 50 }).notNull(),
  sat1Name: text("sat1_name").notNull(),
  sat1Type: varchar("sat1_type", { length: 50 }),
  sat1Rcs: varchar("sat1_rcs", { length: 20 }),
  sat1ExclVol: real("sat1_excl_vol"),
  sat2Id: varchar("sat2_id", { length: 50 }).notNull(),
  sat2Name: text("sat2_name").notNull(),
  sat2Type: varchar("sat2_type", { length: 50 }),
  sat2Rcs: varchar("sat2_rcs", { length: 20 }),
  sat2ExclVol: real("sat2_excl_vol"),
  tca: timestamp("tca", { withTimezone: true }).notNull(),
});

export const neoAlerts = pgTable("neo_alerts", {
  id: text("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  closeApproachDate: timestamp("close_approach_date", {
    withTimezone: true,
  }).notNull(),
  isPotentiallyHazardous: boolean("is_potentially_hazardous").notNull(),
  magnitude: real("magnitude").notNull(),
  missDistance: real("miss_distance").notNull(),
  relativeVelocity: real("relative_velocity").notNull(),
  nasaJplUrl: text("nasa_jpl_url").notNull(),
  orbitingBody: text("orbiting_body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
export const apiRequests = pgTable("api_requests", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  endpoint: text("endpoint").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
