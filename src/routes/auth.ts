import { Router } from "express";
import { check } from "express-validator";

import { registerUser, login, verifyUser } from "../controllers";
import { REQ_BODY_ERRORS } from "../utils/constants";

import { bodyErrors, cacheRoute, verifyToken } from "../middlewares";

const router = Router();

const { INVALID_EMAIL, INVALID_NAME, INVALID_PASSWORD } = REQ_BODY_ERRORS;

router.post(
  "/register",
  [
    check("email", INVALID_EMAIL).isEmail(),
    check("password", INVALID_PASSWORD).isLength({ min: 6 }),
    check("name", INVALID_NAME).matches("\\w{3,} \\w{3,}(?: \\w{3,}){0,2}"),
  ],
  bodyErrors,
  registerUser
);

router.post("/", [check("email", INVALID_EMAIL).isEmail()], bodyErrors, login);

router.get(
  "/verify-user",
  verifyToken,
  cacheRoute(300, "user-data"),
  verifyUser
);

export default router;
