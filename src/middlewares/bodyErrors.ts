import { Response, Request, NextFunction } from "express";
import { validationResult } from "express-validator";

import { errorResponse } from "../utils/helpers";
import { REQ_BODY_ERRORS } from "../utils/constants";

const checkBodyErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return errorResponse(
      400,
      REQ_BODY_ERRORS.BAD_REQUEST_MSG,
      res,
      errors.array()
    );
  next();
};

export default checkBodyErrors;
