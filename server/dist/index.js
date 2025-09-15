"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../.env.local") });
const db_1 = require("./db/db");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./auth/auth.routes"));
const earthRoute_1 = __importDefault(require("./routes/earthRoute"));
const spaceRoutes_1 = __importDefault(require("./routes/spaceRoutes"));
const spaceDataRoute_1 = __importDefault(require("./routes/spaceDataRoute"));
const aiRoutes_1 = __importDefault(require("./routes/aiRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const logApiRequests_1 = require("./middleware/logApiRequests");
const auth_controller_1 = require("./auth/auth.controller");
db_1.pool
    .connect()
    .then((client) => {
    console.log("✅ Database connected successfully!");
    client.release();
})
    .catch((err) => {
    console.error("❌ Database connection error:", err.message);
});
const app = (0, express_1.default)();
app.use(auth_controller_1.protectedRoute);
app.use(logApiRequests_1.logApiRequest);
app.use("/api/payment/webhook", express_1.default.raw({ type: "application/json" }), paymentRoutes_1.default);
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api/auth", auth_routes_1.default);
app.use("/api/ai", aiRoutes_1.default);
app.use("/api/earth", earthRoute_1.default);
app.use("/api/space", spaceRoutes_1.default);
app.use("/api/space-data", spaceDataRoute_1.default);
app.use("/api/payment", paymentRoutes_1.default);
const PORT = process.env.PORT ?? 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
