import { NextFunction, Request, Response } from "express";
import supabase from "./auth.service";
import { db } from "./../db/db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export async function protectedRoute(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user)
      return res.status(401).json({ message: "Invalid token" });

    req.user = data.user;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Unauthorized" });
  }
}

export async function requestOtp(req: Request, res: Response) {
  const { email } = req.body;
  console.log(email);
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
    },
  });

  if (error) return res.status(400).json({ error: error.message });

  return res.json({ message: "OTP sent to email" });
}

//  i should send the email and the token to varify the otp
export async function verifyOtp(req: Request, res: Response) {
  const { email, token } = req.body;
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  if (error) return res.status(400).json({ error: error.message });

  const existing = await db.select().from(users).where(eq(users.email, email));

  if (existing.length === 0) {
    await db.insert(users).values({ email });
  }
  console.log(data.session);
  return res.json({
    message: "User authenticated successfully",
    user: data.user,
    session: data.session.access_token,
  });
}
export async function Me(req: Request, res: Response) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user)
    return res.status(401).json({ message: "Invalid token" });
  return res.json({
    user: data.user,
  });
}
