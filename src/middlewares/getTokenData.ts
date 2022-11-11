import { Response, NextFunction } from "express";

import { decodeToken } from "../utils/helpers";
import { ICustomReq, IReqHeaderUser } from "../types";

const getTokenData = (req: ICustomReq, res: Response, next: NextFunction) => {
  decodeToken<{
    user: IReqHeaderUser;
  }>(req)
    .then((decoded) => {
      req.user = decoded.user!;
      next();
    })
    .catch(() => {
      next();
    });
};

export default getTokenData;
