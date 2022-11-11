import { Router } from "express";
import { check } from "express-validator";

import { updateCompanyInfo, getCompanies } from "../controllers";
import {
  verifyToken,
  bodyErrors,
  multer,
  protectRoute,
  getTokenData,
} from "../middlewares";
import {
  INVALID_COMPANY_LOCATION,
  NO_COMPANY_DESCRIPTION,
  NO_COMPANY_SLOGAN,
} from "../utils/constants";

const router = Router();

router.patch(
  "/",
  multer.single("logo"),
  verifyToken,
  protectRoute("company"),
  [
    check("slogan", NO_COMPANY_SLOGAN).exists(),
    check("location", INVALID_COMPANY_LOCATION).isLength({ min: 3, max: 3 }),
    check("description", NO_COMPANY_DESCRIPTION).exists(),
  ],
  bodyErrors,
  updateCompanyInfo
);

router.get("/", getTokenData, getCompanies);

export default router;
