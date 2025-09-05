import { Router } from "express";
import { requestOtp, verifyOtp, Me } from "./auth.controller";

const router = Router();

router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);
router.get("/me", Me);

export default router;
