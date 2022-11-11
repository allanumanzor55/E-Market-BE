import { Response, NextFunction } from "express";

import { errorResponse, decodeToken } from "../utils/helpers";
import { TOKEN_ERRORS } from "../utils/constants";
import { ICustomReq, IReqHeaderUser } from "../types";

const verifyToken = (req: ICustomReq, res: Response, next: NextFunction) => {
  decodeToken<{
    user: IReqHeaderUser;
  }>(req)
    .then((decoded) => {
      req.user = decoded.user!;
      next();
    })
    .catch((error) => {
      const { NO_TOKEN, ERROR, EXPIRED_TOKEN } = TOKEN_ERRORS;
      errorResponse(401, ERROR, res, [
        { msg: error === "no-token" ? NO_TOKEN : EXPIRED_TOKEN },
      ]);
    });
};

export default verifyToken;
