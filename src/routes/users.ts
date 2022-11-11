import { Router } from "express";
import { addUser, getUsers, updateUserPicture } from "../controllers";
import { REQ_BODY_ERRORS } from "../utils/constants";
import { check } from "express-validator";
import { verifyToken, protectRoute, bodyErrors, multer } from "../middlewares";

const router = Router();
const { INVALID_EMAIL, INVALID_NAME } = REQ_BODY_ERRORS;

router.post(
  "/",
  multer.single("profilePic"),
  [
    check("email", INVALID_EMAIL).isEmail(),
    check("name", INVALID_NAME).matches("\\w{3,} \\w{3,}(?: \\w{3,}){0,2}"),
    check("userType", INVALID_NAME).isNumeric(),
  ],
  verifyToken,
  bodyErrors,
  protectRoute("admin", "company"),
  addUser
);

router.get("/", verifyToken, protectRoute("admin", "company"), getUsers);
router.patch(
  "/update-picture",
  multer.single("picture"),
  verifyToken,
  updateUserPicture
);

export default router;
