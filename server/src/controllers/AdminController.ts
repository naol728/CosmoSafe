import { Request, Response } from "express";
import { db } from "../db/db";
import {
  users,
  disasters,
  earthquakes,
  collisionAlerts,
  neoAlerts,
  apiRequests,
} from "../db/schema";
import { sql, eq } from "drizzle-orm";

export async function fetchAdminAnalytics() {
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

  const sevenDaysRequests = await db
    .select({
      date: sql<string>`DATE("created_at")`,
      count: sql<number>`COUNT(*)`,
    })
    .from(apiRequests)
    .where(sql<string>`"created_at" >= NOW() - INTERVAL '7 DAYS'`)
    .groupBy(sql<string>`DATE("created_at")`)
    .orderBy(sql<string>`DATE("created_at") ASC`);

  const apiRequestsLast7Days = sevenDaysRequests.map((r: any) => ({
    date: r.date,
    count: Number(r.count),
  }));

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
    apiRequestsLast7Days,
  };
}

export const getAdminAnalytics = async (req: Request, res: Response) => {
  try {
    const data = await fetchAdminAnalytics();
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("Failed to get admin analytics:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch admin analytics" });
  }
};
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        email: users.email,
        is_premium: users.is_premium,
        is_admin: users.is_admin,
        created_at: users.created_at,
      })
      .from(users)
      .orderBy(sql`created_at ASC`);

    res.status(200).json({ success: true, users: allUsers });
  } catch (err) {
    console.error("Failed to fetch users:", err);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

export const getTopUsersByRequests = async (req: Request, res: Response) => {
  try {
    const topUsers = await db
      .select({
        userId: apiRequests.userId,
        email: users.email,
        requestCount: sql<number>`COUNT(*)`,
      })
      .from(apiRequests)
      .leftJoin(users, eq(apiRequests.userId, users.id))
      .groupBy(apiRequests.userId, users.email)
      .orderBy(sql`COUNT(*) DESC`)
      .limit(10);

    res.status(200).json({ success: true, topUsers });
  } catch (err) {
    console.error("Failed to fetch top users:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch top users" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({ message: "Valid user id is required" });
    }

    const del = await db.delete(users).where(eq(users.id, id));

    res.json({
      success: true,
      message: "User deleted successfully",
      result: del,
    });
  } catch (err: any) {
    console.error("❌ Delete user error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
