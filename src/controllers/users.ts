import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { TUserRole, ICustomReq, IUser, ICompany } from "../types";
import { UserModel, CompanyModel } from "../models";
import SingleNodeCache from "../lib/SingleNodeCache";
import {
  errorResponse,
  sendResponse,
  sendInternalError,
  getMulterFileUrl,
  generateCacheKey,
} from "../utils/helpers";
import { USER_MSG } from "../utils/constants";

export const addUser = async (req: ICustomReq, res: Response) => {
  const { email, name, userType, companyId } = req.body;
  try {
    let user = await UserModel.findOne({ email });
    const reqUser = req.user!
    let company: ICompany | null = null;
    const profilePic = getMulterFileUrl(req);
    const realCompanyId = companyId || reqUser.companyName.id;
    if (realCompanyId) company = await CompanyModel.findOne({ _id: realCompanyId })!;
    if (user) {
      const { MSG, ERROR } = USER_MSG.EMAIL_TAKEN;
      return errorResponse(400, ERROR, res, [{ msg: MSG }]);
    }

    const role: TUserRole =
      userType == 1 ? "admin" : userType == 2 ? "customer" : "company";

    user = new UserModel({
      email,
      name,
      password: "",
      company: company ? { id: companyId, name: company.name } : undefined,
      profilePic,
      role,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(
      user.name.substring(0, 3) +
      user.role.substring(0, 3) +
      user.email.substring(0, 3) +
      Math.floor(Math.random() * (99999 - 100 + 1) + 100),
      salt
    );

    await user.save();

    sendResponse(201, USER_MSG.ADD_USER.MSG, res, { user: user.name });
  } catch (error) {
    sendInternalError(res, error);
  }
};

export const getUsers = async (req: ICustomReq, res: Response) => {
  try {
    let users: Partial<IUser>[] = [];
    const { role, companyName, id } = req.user!;
    if (role === "admin") users = await UserModel.find({});
    else users = await UserModel.find({ company: companyName });

    users = users
      .map(({ id, name, company, email, profilePic, role }) => {
        return {
          id,
          name,
          companyName: company?.name || "",
          email,
          profilePic,
          role,
        };
      })
      .filter((u) => u.id !== id);
    sendResponse(200, USER_MSG.ADMIN_GET_USERS, res, { list: users });
  } catch (e) {
    sendInternalError(res, e);
  }
};

export const updateUserPicture = async (req: ICustomReq, res: Response) => {
  try {
    const newPicUrl = getMulterFileUrl(req);
    const updateRes = await UserModel.updateOne(
      { _id: req.user!.id },
      {
        $set: { profilePic: newPicUrl },
      }
    );
    const { modifiedCount } = updateRes;
    const { INVALID_TOKEN_USER, PICTURE_UPDATED } = USER_MSG;
    if (!modifiedCount)
      return sendResponse(304, INVALID_TOKEN_USER.MSG, res, {});
    const cache = SingleNodeCache.getInstance();
    const cacheKey = generateCacheKey(req, "user-data");
    cache.del(cacheKey);
    sendResponse(200, PICTURE_UPDATED, res, { newPicUrl });
  } catch (e) {
    sendInternalError(res, e);
  }
};
