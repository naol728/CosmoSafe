import { Request, Response } from "express";
import supabase from "./auth.service";
import { db } from "./../db/db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export async function requestOtp(req: Request, res: Response) {
  const { email } = req.body;
  console.log(email);
  const { error } = await supabase.auth.signInWithOtp({ email });

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

  return res.json({
    message: "User authenticated successfully",
    user: data.user,
    session: data.session,
  });
}
