import { Response, Request } from "express";
import jwt from "jsonwebtoken";

import { ICustomRes } from "types";

import { INTERNAL_ERROR_MSG } from "./constants";

/**
 *
 * Send an error response
 *
 * @param status code of the response
 * @param msg message for the FE
 * @param res express response object
 * @param errors list of errors for the user
 */
export const errorResponse = (
  status: number,
  msg: string,
  res: Response,
  errors: { msg: string }[]
) => {
  res.status(status).json({ msg, errors });
};

/**
 *
 * Send a response
 *
 * @param status code of the response
 * @param msg message for the FE
 * @param res express response object
 * @param data data to be sent
 */
export const sendResponse = (
  status: number,
  msg: string,
  res: ICustomRes,
  data: Record<string, unknown>,
  cache?: boolean
) => {
  const resStatus = res.status(status);
  if (cache && resStatus.sendAndCache) resStatus.sendAndCache({ msg, data });
  else resStatus.json({ msg, data });
};

/**
 *
 * @param res express response object
 * @param error error object or message to display on console
 * @param status error status
 * @param msg error message to be sent
 */
export const sendInternalError = (
  res: Response,
  error: unknown,
  status = 500,
  msg?: string
) => {
  console.log(
    "Server error",
    typeof error === "string"
      ? error
      : error instanceof Error
      ? error.message
      : "Unknown :)))))"
  );

  const { MSG, ERROR } = INTERNAL_ERROR_MSG;
  errorResponse(status || 500, msg || ERROR, res, [{ msg: MSG }]);
};

export const getToken = (req: Request) =>
  req.headers["authorization"]?.split(" ").pop();

export const generateCacheKey = (
  req: Request,
  baseKey: string,
  token?: string
) => {
  const tokenToUse = token || getToken(req);
  return `${baseKey}-${(tokenToUse || "").slice(-10)}`.trim();
};

export const decodeToken = <T>(req: Request): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    const token = getToken(req);
    if (!token) return reject("no-token");
    try {
      resolve(jwt.verify(token, process.env.JWT_SECRET!) as T);
    } catch (error) {
      reject("token-expired");
    }
  });
};

/**
 *
 * Get the url generated after uploading the file to S3
 *
 * @param req express request object.
 * @returns url of uploaded file
 */
export const getMulterFileUrl = (req: Request) =>
  (req.file as Express.MulterS3.File)?.location || "";
