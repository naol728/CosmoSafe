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
} from "../controllers/spaceController";
import { protectedRoute } from "../auth/auth.controller";

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
router.get("/get/neo-alert", getUserNeo);

export default router;
