import { Router, Request, Response, NextFunction } from "express";
import { check } from "express-validator";

import { createPage } from "../controllers";
import { verifyToken, bodyErrors, protectRoute, multer } from "../middlewares";
import { NO_PAGE_TITLE } from "../utils/constants";

const router = Router();

router.post(
  "/",
  multer.single("icon"),
  verifyToken,
  protectRoute("admin", "company"),
  [check("title", NO_PAGE_TITLE).isLength({ min: 3 })],
  bodyErrors,
  createPage
);

export default router;
