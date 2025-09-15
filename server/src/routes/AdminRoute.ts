import { Router } from "express";
import {
  deleteUser,
  getAdminAnalytics,
  getAllUsers,
  getTopUsersByRequests,
} from "../controllers/AdminController";

const router = Router();

router.get("/analytics", getAdminAnalytics);

router.get("/users", getAllUsers);
router.get("/top-users", getTopUsersByRequests);
router.delete("/del/user", deleteUser);
export default router;
