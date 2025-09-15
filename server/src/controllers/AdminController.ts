import { db } from "./../db/db";
import {
  users,
  disasters,
  earthquakes,
  collisionAlerts,
  neoAlerts,
  apiRequests,
} from "./../db/schema";
import { sql, eq } from "drizzle-orm";

export async function getAdminAnalytics() {
  const [{ count: totalUsers }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(users);

  const [{ count: premiumUsers }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(users)
    .where(eq(users.is_premium, true));

  const [{ count: totalDisasters }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(disasters);

  const [{ count: totalEarthquakes }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(earthquakes);

  const [{ count: totalCollisions }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(collisionAlerts);

  const [{ count: totalNeoAlerts }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(neoAlerts);

  const [{ count: totalApiRequests }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(apiRequests);

  return {
    users: {
      total: Number(totalUsers),
      premium: Number(premiumUsers),
    },
    disasters: Number(totalDisasters),
    earthquakes: Number(totalEarthquakes),
    collisionAlerts: Number(totalCollisions),
    neoAlerts: Number(totalNeoAlerts),
    apiRequests: Number(totalApiRequests),
  };
}
