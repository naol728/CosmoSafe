import { Router } from "express";
import {
  getOrbitalTracking,
  getSpaceWeatherNow,
  getSpaceWeatherForecast,
  getCollisionAlerts,
  getISSPosition,
  getNearbyObjects,
} from "../controllers/spaceController";

const router = Router();

router.get("/orbit/:id", getOrbitalTracking);
router.get("/space-weather/now", getSpaceWeatherNow);
router.get("/space-weather/forecast", getSpaceWeatherForecast);
router.get("/collision-alerts", getCollisionAlerts);
router.get("/iss", getISSPosition);
router.get("/nearby", getNearbyObjects);

export default router;
