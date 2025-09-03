import { Request, Response } from "express";
import { supabase } from "../db/supabaseClient";

export const signup = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json({ message: "User signed up", user: data.user });
  } catch (err) {
    res.status(500).json({ error: "Signup failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return res.status(400).json({ error: error.message });

    res
      .status(200)
      .json({ message: "Login successful", session: data.session });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};

export const logout = async (_req: Request, res: Response) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json({ message: "Logged out" });
  } catch (err) {
    res.status(500).json({ error: "Logout failed" });
  }
};
