import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { TUserRole, IUser, ICustomReq } from "../types";
import { UserModel, CompanyModel } from "../models";
import {
  errorResponse,
  sendResponse,
  sendInternalError,
} from "../utils/helpers";
import { USER_MSG, COMPANY_ALREADY_EXISTS } from "../utils/constants";

const sendInvalidCredentials = (res: Response) => {
  const { MSG, ERROR } = USER_MSG.INVALID_CREDENTIALS;
  errorResponse(400, ERROR, res, [{ msg: MSG }]);
};

export const registerUser = async (
  req: ICustomReq<IUser & { companyName: string }>,
  res: Response
) => {
  const { email, name, password, companyName } = req.body;
  try {
    let user = await UserModel.findOne({ email });
    if (user) {
      const { ERROR, MSG } = USER_MSG.EMAIL_TAKEN;
      return errorResponse(400, ERROR, res, [{ msg: MSG }]);
    }

    const role: TUserRole = companyName ? "company" : "customer";

    user = new UserModel({
      email,
      name,
      password,
      role,
    });

    if (companyName) {
      let company = await CompanyModel.findOne({ name: companyName });
      if (company) {
        const { ERROR, MSG } = COMPANY_ALREADY_EXISTS;
        return errorResponse(400, ERROR, res, [{ msg: MSG }]);
      }
      company = new CompanyModel({
        name: companyName,
        slogan: "",
        description: "",
        location: "",
        employees: [user.id],
        logo: "",
        pages: [],
      });

      await company.save();
      user.company = {
        id: company.id,
        name: company.name,
      };
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    const payload = {
      user: { id: user.id, role: user.role, companyName: user.company },
    };

    const { JWT_EXPIRATION, JWT_SECRET } = process.env;

    user.lastLogin = Date.now();
    await user.save();

    jwt.sign(
      payload,
      JWT_SECRET!,
      { expiresIn: JWT_EXPIRATION },
      async (err, token) => {
        if (err) throw err;
        sendResponse(201, USER_MSG.USER_REGISTERED, res, {
          token,
          role: user!.role,
          name: user!.name,
          profilePic: user!.profilePic || "",
        });
      }
    );
  } catch (error) {
    sendInternalError(res, error);
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    let user = await UserModel.findOne({ email });
    if (!user) return sendInvalidCredentials(res);

    const match = await bcrypt.compare(password, user.password);
    if (!match) return sendInvalidCredentials(res);

    const payload = {
      user: { id: user.id, role: user.role, companyName: user.company },
    };
    const { JWT_EXPIRATION, JWT_SECRET } = process.env;

    user.lastLogin = Date.now();
    await user.save();

    jwt.sign(
      payload,
      JWT_SECRET!,
      { expiresIn: JWT_EXPIRATION },
      async (err, token) => {
        if (err) throw err;
        sendResponse(200, USER_MSG.USER_LOGGED_IN, res, {
          token,
          lastLogin: user!.lastLogin,
          role: user!.role,
          name: user!.name,
          profilePic: user!.profilePic || "",
        });
      }
    );
  } catch (e) {
    sendInternalError(res, e);
  }
};

export const verifyUser = async (req: ICustomReq, res: Response) => {
  try {
    const { ERROR, MSG } = USER_MSG.INVALID_TOKEN_USER;
    const user = await UserModel.findOne({ _id: req.user!.id });
    if (!user) return errorResponse(401, ERROR, res, [{ msg: MSG }]);
    sendResponse(
      200,
      "role",
      res,
      { role: user.role, name: user.name, profilePic: user.profilePic },
      true
    );
  } catch (e) {
    sendInternalError(res, e);
  }
};
