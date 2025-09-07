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

export async function verifyOtp(req: Request, res: Response) {
  const { email, token } = req.body;

  // Verify the OTP
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

  const session = data.session;
  const longLivedToken = {
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_at: session.expires_at,
  };

  return res.json({
    message: "User authenticated successfully",
    user: data.user,
    session: {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at,
    },
  });
}

export async function Me(req: Request, res: Response) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    const { data: authData, error: authError } = await supabase.auth.getUser(
      token
    );

    if (authError || !authData?.user) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const authUser = authData.user;

    const dbUser = await db
      .select()
      .from(users)
      .where(eq(users.email, authUser.email!))
      .limit(1);

    if (!dbUser.length) {
      return res.status(404).json({ message: "User not found in database" });
    }

    const mergedUser = {
      id: authUser.id,
      email: authUser.email,
      created_at: authUser.created_at,
      ...dbUser[0],
    };

    return res.json({ user: mergedUser });
  } catch (err) {
    console.error("Error in Me:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function refreshToken(req: Request, res: Response) {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token)
      return res.status(400).json({ message: "No refresh token provided" });

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token,
    });

    if (error)
      return res.status(401).json({ message: "Invalid refresh token" });

    return res.json({
      access_token: data.session.access_token,
      expires_at: data.session.expires_at,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
