import { Router } from "express";
import { requestOtp, verifyOtp, Me, refreshToken } from "./auth.controller";

const router = Router();

router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);
router.post("/refresh", refreshToken);
router.get("/me", Me);

export default router;
