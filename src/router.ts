import { justify, getToken } from "./controllers";
import rateLimit from "express-rate-limit";
import { mailRgx } from "./utils";
import express from "express";

const router = express.Router();

const rateLimiter = rateLimit({
  windowMs: Number(process.env.TOKENS_RATE_LIMIT_TIMEOUT!),
  max: Number(process.env.TOKENS_MAX_REQUEST!),
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => !mailRgx.test(req?.body?.email) ? true : false
});

router.route("/tokens").post(rateLimiter, getToken);
router.route("/justify").post(justify);

export default router;
