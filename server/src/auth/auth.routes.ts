import { Router } from "express";
import { requestOtp, verifyOtp } from "./auth.controller";

const router = Router();

router.post("/auth/request-otp", requestOtp);
router.post("/auth/verify-otp", verifyOtp);

export default router;
