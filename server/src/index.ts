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
import adminRoute from "./routes/AdminRoute";
import { logApiRequest } from "./middleware/logApiRequests";

pool
  .connect()
  .then((client) => {
    console.log("✅ Database connected successfully!");
    client.release();
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err);
  });

const app = express();
// app.use(
//   morgan(":method :url :status :res[content-length] - :response-time ms")
// );
app.use(logApiRequest);
app.use(
  "/api/payment/webhook",
  express.raw({ type: "application/json" }),
  paymentRoutes
);

app.use(express.json());
app.use(cors());
app.use("/api/admin", adminRoute);
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/earth", earthRoutes);
app.use("/api/space", spaceRoutes);
app.use("/api/space-data", spaceDataRoute);
app.use("/api/payment", paymentRoutes);

const PORT = 7000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
