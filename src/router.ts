import { justify, getToken } from "./controllers";
import rateLimit from "express-rate-limit";
import express from "express";

const router = express.Router();

const rateLimiter = rateLimit({
  windowMs: Number(process.env.TOKENS_RATE_LIMIT_TIMEOUT!),
  max: Number(process.env.TOKENS_MAX_REQUEST!),
  standardHeaders: true,
  legacyHeaders: false,
});

router.route("/tokens").post(rateLimiter, getToken);
router.route("/justify").post(justify);

export default router;
