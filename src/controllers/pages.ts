import { Response } from "express";
import {} from "multer";

import { PageModel } from "../models";
import { ICustomReq } from "../types";
import { sendInternalError, sendResponse } from "../utils/helpers";
import { PAGE_CREATED } from "../utils/constants";

export const createPage = (req: ICustomReq, res: Response) => {
  // TODO: verificar si la página o directorio existen dentro de la empresa
  // TODO: añadir la página a la empresa
  const { title, directoryName, icon } = req.body;
  const iconUrl = (req.file as Express.MulterS3.File)?.location;
  try {
    const page = new PageModel({
      title,
      directoryName: directoryName || title,
      icon: iconUrl || "",
    });
    page.save();
    sendResponse(204, PAGE_CREATED, res, {});
  } catch (e) {
    sendInternalError(res, e);
  }
};
