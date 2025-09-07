import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
import { pool } from "./db/db";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./auth/auth.routes";
import earthRoutes from "./routes/earthRoute";
pool
  .connect()
  .then((client) => {
    console.log("✅ Database connected successfully!");
    client.release();
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err.message);
  });

const app = express();
app.use(morgan(":method :url :status :response-time ms"));
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/earth", earthRoutes);

const PORT = process.env.PORT ?? 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
