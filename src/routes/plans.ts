import { Router } from "express";
import { check } from "express-validator";
import { verifyToken, protectRoute } from "../middlewares";
import { addPlan, getPlan, selectedPlan} from "../controllers";
import { REQ_BODY_ERRORS } from "../utils/constants";
import checkBodyErrors from "../middlewares/bodyErrors";

const router = Router();

const { INVALID_NAME_PLAN, INVALID_SLOGAN_PLAN, INVALID_ICON_PLAN } = REQ_BODY_ERRORS;

router.post(
  "/",
  [
    check("icon", INVALID_ICON_PLAN).isLength({ min: 2 }),
    check("slogan", INVALID_SLOGAN_PLAN).isLength({ min: 6 }),
    check("name", INVALID_NAME_PLAN).isLength({ min: 6 })
  ],checkBodyErrors, verifyToken, protectRoute("admin"),
  addPlan
);

router.get("/", verifyToken, protectRoute("admin", "company"), getPlan);

router.post(
  "/selected", verifyToken, protectRoute("company"),
  selectedPlan
);

export default router;
