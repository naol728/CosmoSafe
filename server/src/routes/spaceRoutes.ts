import { Router } from "express";
import {
  getOrbitalTracking,
  getSpaceWeatherNow,
  getSpaceWeatherForecast,
  getCollisionAlerts,
  getISSPosition,
  getNearbyObjects,
  createCollisionAlert,
  getUserCollisons,
  createNeoAlert,
  getUserNeo,
  fetchArticles,
  getArticleById,
  deleteUserCollison,
  deleteUserNeo,
} from "../controllers/spaceController";
import { protectedRoute } from "../auth/auth.controller";
import { paginationMiddleware } from "../utils/pagination";

const router = Router();
router.use(protectedRoute);
router.get("/orbit/:id", getOrbitalTracking);
router.get("/space-weather/now", getSpaceWeatherNow);
router.get("/space-weather/forecast", getSpaceWeatherForecast);
router.get("/collision-alerts", getCollisionAlerts);
router.get("/iss", getISSPosition);
router.get("/nearby", getNearbyObjects);
router.post("/create/collision-alert", createCollisionAlert);
router.post("/create/neo-alert", createNeoAlert);
router.get("/get/collision-alert", getUserCollisons);
router.delete("/delete/collision-alert/:id", deleteUserCollison);
router.get("/get/neo-alert", getUserNeo);
router.delete("/get/neo-alert/:id", deleteUserNeo);
router.get("/get/articles", paginationMiddleware, fetchArticles);
router.get("/get/articles/:id", getArticleById);

export default router;
