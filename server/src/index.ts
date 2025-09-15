import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
import { pool } from "./db/db";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./auth/auth.routes";
import earthRoutes from "./routes/earthRoute";
import spaceRoutes from "./routes/spaceRoutes";
import spaceDataRoute from "./routes/spaceDataRoute";
import aiRoutes from "./routes/aiRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import { logApiRequest } from "./middleware/logApiRequests";
import { protectedRoute } from "./auth/auth.controller";
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
app.use(protectedRoute);
app.use(logApiRequest);
app.use(
  "/api/payment/webhook",
  express.raw({ type: "application/json" }),
  paymentRoutes
);

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/earth", earthRoutes);
app.use("/api/space", spaceRoutes);
app.use("/api/space-data", spaceDataRoute);

app.use("/api/payment", paymentRoutes);

const PORT = process.env.PORT ?? 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
