import { Request, Response, NextFunction } from "express";
import { db } from "../db/db";
import { apiRequests } from "../db/schema";
import supabase from "../auth/auth.service";

export async function logApiRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    let userId: string | null = null;

    if (token) {
      try {
        const { data, error } = await supabase.auth.getUser(token);
        if (error) throw error;
        userId = data.user?.id ?? null;
        req.user = data.user;
      } catch (err) {
        console.warn("Supabase token validation failed:", err.message || err);
      }
    }

    db.insert(apiRequests)
      .values({
        userId,
        endpoint: req.originalUrl,
      })
      .catch((err) => console.error("Failed to log API request:", err));
  } catch (err) {
    console.error("Unexpected error in logApiRequest:", err);
  } finally {
    next();
  }
}
