import { Response, NextFunction } from "express";

import { errorResponse } from "../utils/helpers";
import { TUserRole, ICustomReq } from "../types";
import { USER_MSG } from "../utils/constants";

const protectRoute =
  (...roles: TUserRole[]) =>
  (req: ICustomReq, res: Response, next: NextFunction) => {
    const { ERROR, MSG } = USER_MSG.UNAUTHORIZED;
    if (!roles.includes(req.user!.role))
      return errorResponse(401, ERROR, res, [{ msg: MSG }]);
    next();
  };

export default protectRoute;
