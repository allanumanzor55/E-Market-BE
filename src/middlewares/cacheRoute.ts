import { Request, NextFunction } from "express";

import SingleNodeCache from "../lib/SingleNodeCache";
import { generateCacheKey, getToken } from "../utils/helpers";

import { ICustomRes } from "types";

const cache = SingleNodeCache.getInstance();

const cacheRoute =
  (duration: number, baseKey: string) =>
  (req: Request, res: ICustomRes, next: NextFunction) => {
    if (req.method !== "GET") return next();
    const token = getToken(req);
    const key = generateCacheKey(req, baseKey, token);
    const cachedResponse = cache.get(key);

    if (cachedResponse) res.send(cachedResponse);
    else {
      res.sendAndCache = (body: Record<string, unknown>) => {
        res.json(body);
        cache.set(key, body, duration);
      };
      next();
    }
  };

export default cacheRoute;
