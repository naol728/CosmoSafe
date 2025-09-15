import { Request, Response, NextFunction } from "express";
import { db } from "../db/db";
import { apiRequests } from "../db/schema";

export async function logApiRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user?.id ?? null;
    const endpoint = req.originalUrl;

    await db.insert(apiRequests).values({
      userId,
      endpoint,
    });
  } catch (err) {
    console.error("Failed to log API request:", err);
  }
  next();
}
