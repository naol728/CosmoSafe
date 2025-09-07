import { Router } from "express";
import {
  getCarbon,
  getDisasters,
  getFlood,
  getWeather,
} from "../controllers/earthController";
import { paginationMiddleware } from "../utils/pagination";

const router = Router();
router.use(paginationMiddleware);

router.get("/disaster", getDisasters);
router.get("/weather", getWeather);
router.get("/flood", getFlood);
router.get("/carbon", getCarbon);

export default router;
