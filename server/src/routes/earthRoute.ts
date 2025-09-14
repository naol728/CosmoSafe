import { Router } from "express";
import {
  addDisaster,
  addEarthquake,
  deleteUserdisaster,
  deleteUserEarthQuak,
  getCarbon,
  getDisasters,
  getEarthquakedb,
  getEarthquakes,
  getFlood,
  getUserDisasters,
  getWeather,
} from "../controllers/earthController";
import { paginationMiddleware } from "../utils/pagination";
import { protectedRoute } from "../auth/auth.controller";

const router = Router();
router.use(paginationMiddleware);
router.use(protectedRoute);
router.get("/disaster", getDisasters);
router.get("/weather", getWeather);
router.get("/flood", getFlood);
router.get("/earthquake", getEarthquakes);
router.get("/carbon", getCarbon);
router.get("/get/earthquake", getEarthquakedb);
router.post("/add/earthquake", addEarthquake);
router.delete("/delete/earthquake/:id", deleteUserEarthQuak);
router.post("/add/disaster", addDisaster);
router.get("/get/disaster", getUserDisasters);
router.delete("/delete/disaster/:id", deleteUserdisaster);

export default router;
